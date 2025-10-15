import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { uploadToDrive, appendToSheet } from "./google-api";
import { z } from "zod";
import bcrypt from "bcrypt";

const upload = multer({ storage: multer.memoryStorage() });

const GOOGLE_DRIVE_FOLDER_ID = "0APKlsIj58AdeUk9PVA";
const GOOGLE_SHEET_ID = "1IzB51OMk0R14D_AoHy1aJxNZ5myY05eHMx-Y3bQnjoE";

export async function registerRoutes(app: Express): Promise<Server> {
  // Send OTP endpoint
  app.post("/api/send-otp", async (req, res) => {
    try {
      const { mobileNumber } = z
        .object({ mobileNumber: z.string() })
        .parse(req.body);

      // Generate 5-digit OTP
      const otp = Math.floor(10000 + Math.random() * 90000).toString();

      await storage.saveOtp(mobileNumber, otp);

      const gupshupApiKey = process.env.GUPSHUP_API_KEY?.trim();
      const gupshupUserId = process.env.GUPSHUP_USER_ID?.trim();
      const dltTemplateId = "1207167325073593251";
      const principalEntityId = process.env.DLT_PRINCIPAL_ENTITY_ID?.trim();

      if (gupshupApiKey && gupshupUserId && principalEntityId) {
        const phoneNumber = mobileNumber.startsWith("91")
          ? mobileNumber
          : `91${mobileNumber}`;

        if (process.env.NODE_ENV === "development") {
          console.log(
            `[OTP DEBUG] Generated OTP for ${mobileNumber}: ${otp}`,
          );
          console.log(
            `[CREDENTIALS DEBUG] userId length: ${gupshupUserId?.length}, apiKey length: ${gupshupApiKey?.length}, principalEntityId length: ${principalEntityId?.length}`,
          );
        }

        const message = `OTP is ${otp} for Aspire For Her. Do not share the OTP for security reasons`;

        const response = await fetch(
          "https://enterprise.smsgupshup.com/GatewayAPI/rest",
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              method: "SendMessage",
              send_to: phoneNumber,
              msg: message,
              msg_type: "Text",
              userid: gupshupUserId,
              auth_scheme: "plain",
              password: gupshupApiKey,
              v: "1.1",
              format: "text",
              dltTemplateId: dltTemplateId,
              principalEntityId: principalEntityId,
              mask: "AspFoH",
            }),
          },
        );

        const responseText = await response.text();
        console.log(
          `Gupshup SMS response for ${phoneNumber}:`,
          responseText,
        );

        if (!responseText.includes("success")) {
          console.error(
            `Gupshup SMS failed for ${phoneNumber}:`,
            responseText,
          );
          return res.status(500).json({ 
            success: false,
            message: "Failed to send SMS. Please try again." 
          });
        }

        res.json({ message: "OTP sent successfully", success: true });
      } else {
        // Development mode - allow without SMS for testing
        if (process.env.NODE_ENV === "development") {
          console.log(
            `OTP for ${mobileNumber}: ${otp}`,
            "(Gupshup credentials not configured)",
          );
          res.json({ message: "OTP sent successfully (dev mode)", success: true });
        } else {
          return res.status(500).json({
            success: false,
            message: "SMS service not configured"
          });
        }
      }
    } catch (error) {
      res.status(400).json({ message: "Failed to send OTP" });
    }
  });

  // Verify OTP endpoint
  app.post("/api/verify-otp", async (req, res) => {
    try {
      const { mobileNumber, otp } = z
        .object({ 
          mobileNumber: z.string(),
          otp: z.string()
        })
        .parse(req.body);

      if (process.env.NODE_ENV === "development") {
        console.log(`[OTP VERIFY] Looking for OTP for mobile: ${mobileNumber}, OTP: ${otp}`);
      }

      const storedOtp = await storage.getOtp(mobileNumber);

      if (process.env.NODE_ENV === "development") {
        console.log(`[OTP VERIFY] Found stored OTP: ${storedOtp}`);
      }

      if (!storedOtp) {
        return res.status(400).json({ 
          success: false, 
          message: "OTP has expired. Please request a new one.",
          errorType: "expired"
        });
      }

      if (storedOtp !== otp) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid OTP. Please check and try again.",
          errorType: "invalid"
        });
      }

      // OTP verified successfully - keep it for password reset verification
      // OTP will be deleted after successful password reset

      res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: "Failed to verify OTP" 
      });
    }
  });

  // Registration API endpoint
  app.post("/api/register", upload.single("selfie"), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      const registrationData = JSON.parse(req.body.data);
      let photoUrl = "";

      // Upload selfie to Google Drive if provided
      if (req.file) {
        const fileName = `${registrationData.step1.fullName.replace(/\s+/g, '_')}_${Date.now()}.jpg`;
        photoUrl = await uploadToDrive(
          req.file.buffer,
          fileName,
          req.file.mimetype,
          GOOGLE_DRIVE_FOLDER_ID
        );
      }

      // Calculate age from date of birth
      const dob = registrationData.step1.dateOfBirth;
      const birthDate = new Date(`${dob.year}-${dob.month.padStart(2, '0')}-${dob.day.padStart(2, '0')}`);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      // Format date of birth as DD/MM/YYYY
      const dobFormatted = `${dob.day.padStart(2, '0')}/${dob.month.padStart(2, '0')}/${dob.year}`;
      
      // Format enrollment date as DD/MM/YYYY
      const enrollmentDate = new Date();
      const enrollmentFormatted = `${enrollmentDate.getDate().toString().padStart(2, '0')}/${(enrollmentDate.getMonth() + 1).toString().padStart(2, '0')}/${enrollmentDate.getFullYear()}`;

      // Hash password securely
      const hashedPassword = await bcrypt.hash(registrationData.step4.password, 10);

      // Save user to database first to get the AFH ID
      const user = await storage.createUser({
        fullName: registrationData.step1.fullName,
        gender: registrationData.step1.gender,
        guardianName: registrationData.step1.guardianName,
        guardianOccupation: registrationData.step1.guardianOccupation,
        dateOfBirth: JSON.stringify(registrationData.step1.dateOfBirth),
        collegeName: registrationData.step2.collegeName,
        course: registrationData.step2.course,
        startYear: registrationData.step2.startYear,
        endYear: registrationData.step2.endYear,
        city: registrationData.step2.city,
        district: registrationData.step2.district,
        state: registrationData.step2.state,
        pincode: registrationData.step2.pincode,
        studentContact: registrationData.step3.studentContact,
        whatsappNumber: registrationData.step3.whatsappNumber,
        guardianContact: registrationData.step3.guardianContact,
        email: registrationData.step3.email,
        familyIncome: registrationData.step3.familyIncome,
        aadhaar: registrationData.step4.aadhaar,
        isPWD: registrationData.step4.isPWD,
        isGovtEmployee: registrationData.step4.isGovtEmployee,
        selfieUrl: photoUrl || null,
        password: hashedPassword,
      });

      // Prepare data for Google Sheets with AFH ID as first column
      const sheetRow = [
        user.id, // AFH Student ID (first column)
        registrationData.step4.aadhaar, // Aadhaar No
        enrollmentFormatted, // Enrollment Date
        registrationData.step1.fullName, // Name
        age.toString(), // Age
        registrationData.step1.gender, // Gender
        registrationData.step3.studentContact, // Contact
        registrationData.step2.state, // State
        registrationData.step2.district, // District
        registrationData.step2.city, // City
        registrationData.step2.collegeName, // College Name
        registrationData.step2.course, // Highest Qualification Course
        registrationData.step3.familyIncome, // Annual Family Income in INR
        "", // Centre Name (empty)
        "", // Training Location District Name
        "", // Training Location City Name
        dobFormatted, // Date of Birth
        registrationData.step3.email, // Email ID
        registrationData.step1.guardianName, // Parent/Guardian Name
        registrationData.step3.guardianContact, // Parent/Guardian Phone Number
        registrationData.step1.guardianOccupation, // Parent/Guardian Occupation
        "", // Beneficiary Work Experience (in Years) (empty)
        "", // Enrollment Status (empty)
        "", // System Generated Course ID (empty)
        "", // Batch ID (empty)
        "", // Onboarding Source (empty)
        registrationData.step4.isPWD, // PWD (Status)
        registrationData.step4.isGovtEmployee, // Is a family member govt. employee?
      ];

      // Append to Google Sheet with AFH ID
      await appendToSheet(GOOGLE_SHEET_ID, sheetRow);

      // Delete OTP after successful registration
      await storage.deleteOtp(registrationData.step3.studentContact);

      res.json({ 
        success: true, 
        message: "Registration submitted successfully",
        userId: user.id 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to submit registration" 
      });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { mobileNumber, password } = z.object({
        mobileNumber: z.string(),
        password: z.string(),
      }).parse(req.body);

      const user = await storage.getUserByPhone(mobileNumber);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid mobile number or password" 
        });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid mobile number or password" 
        });
      }

      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;

      res.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to login" 
      });
    }
  });

  // Reset password endpoint
  app.post("/api/reset-password", async (req, res) => {
    try {
      const { mobileNumber, otp, newPassword } = z.object({
        mobileNumber: z.string(),
        otp: z.string(),
        newPassword: z.string().min(6),
      }).parse(req.body);

      // Verify OTP before allowing password reset
      const savedOtp = await storage.getOtp(mobileNumber);
      
      if (!savedOtp || savedOtp !== otp) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid or expired OTP" 
        });
      }

      // Find user by mobile number
      const user = await storage.getUserByPhone(mobileNumber);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update user password
      await storage.updateUserPassword(user.id, hashedPassword);

      // Delete OTP after successful password reset
      await storage.deleteOtp(mobileNumber);

      res.json({ 
        success: true, 
        message: "Password reset successful" 
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to reset password" 
      });
    }
  });

  // Get user profile by ID
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      res.json({ success: true, user });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch user data" 
      });
    }
  });

  // Save attendance record
  app.post("/api/attendance", async (req, res) => {
    try {
      const attendanceData = z.object({
        userId: z.string(),
        sessionId: z.string(),
        courseId: z.string(),
        sessionName: z.string(),
        courseName: z.string(),
        sessionDate: z.string(),
        mode: z.string(),
        locationLat: z.string().optional(),
        locationLong: z.string().optional(),
        locationAddress: z.string().optional(),
        rating: z.number(),
        feedback: z.string().optional(),
      }).parse(req.body);

      const record = await storage.createAttendanceRecord(attendanceData);

      res.json({ 
        success: true, 
        message: "Attendance recorded successfully",
        record 
      });
    } catch (error) {
      console.error("Save attendance error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to save attendance record" 
      });
    }
  });

  // Get attendance records for a user
  app.get("/api/attendance/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const records = await storage.getAttendanceRecords(userId);

      res.json({ 
        success: true, 
        records 
      });
    } catch (error) {
      console.error("Get attendance error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch attendance records" 
      });
    }
  });

  // Get attendance stats for a user
  app.get("/api/attendance/stats/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const stats = await storage.getAttendanceStats(userId);

      res.json({ 
        success: true, 
        stats 
      });
    } catch (error) {
      console.error("Get attendance stats error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch attendance stats" 
      });
    }
  });

  // Upload offer letter
  app.post("/api/offer-letters/upload", upload.single("file"), async (req: Request & { file?: Express.Multer.File }, res) => {
    try {
      const { userId, company, position } = z.object({
        userId: z.string(),
        company: z.string(),
        position: z.string(),
      }).parse(JSON.parse(req.body.data));

      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "No file uploaded" 
        });
      }

      // Upload to Google Drive
      const fileName = `${company.replace(/\s+/g, '_')}_${position.replace(/\s+/g, '_')}_${Date.now()}.${req.file.originalname.split('.').pop()}`;
      const fileUrl = await uploadToDrive(
        req.file.buffer,
        fileName,
        req.file.mimetype,
        GOOGLE_DRIVE_FOLDER_ID
      );

      // Save to database
      const offer = await storage.createOfferLetter({
        userId,
        type: "uploaded",
        company,
        position,
        status: "pending",
        fileName: req.file.originalname,
        fileUrl,
        fileType: req.file.mimetype,
        receivedDate: new Date().toISOString().split('T')[0],
      });

      res.json({ 
        success: true, 
        message: "Offer letter uploaded successfully",
        offer 
      });
    } catch (error) {
      console.error("Upload offer letter error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to upload offer letter" 
      });
    }
  });

  // Get offer letters for a user
  app.get("/api/offer-letters/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const offers = await storage.getOfferLetters(userId);

      res.json({ 
        success: true, 
        offers 
      });
    } catch (error) {
      console.error("Get offer letters error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch offer letters" 
      });
    }
  });

  // Accept offer letter
  app.post("/api/offer-letters/:id/accept", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.acceptOfferLetter(id);

      res.json({ 
        success: true, 
        message: "Offer accepted successfully" 
      });
    } catch (error) {
      console.error("Accept offer error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to accept offer" 
      });
    }
  });

  // Reject offer letter
  app.post("/api/offer-letters/:id/reject", async (req, res) => {
    try {
      const id = req.params.id;
      await storage.rejectOfferLetter(id);

      res.json({ 
        success: true, 
        message: "Offer rejected successfully" 
      });
    } catch (error) {
      console.error("Reject offer error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to reject offer" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
