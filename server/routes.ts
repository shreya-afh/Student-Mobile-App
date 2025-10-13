import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { uploadToDrive, appendToSheet } from "./google-api";
import { z } from "zod";

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

      const storedOtp = await storage.getOtp(mobileNumber);

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

      // OTP verified successfully, delete it
      await storage.deleteOtp(mobileNumber);

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

      // Prepare data for Google Sheets
      const sheetRow = [
        new Date().toISOString(),
        registrationData.step1.fullName,
        registrationData.step1.gender,
        registrationData.step1.guardianName,
        registrationData.step1.guardianOccupation,
        `${registrationData.step1.dateOfBirth.day}/${registrationData.step1.dateOfBirth.month}/${registrationData.step1.dateOfBirth.year}`,
        registrationData.step2.collegeName,
        registrationData.step2.course,
        registrationData.step2.startYear,
        registrationData.step2.endYear,
        registrationData.step2.city,
        registrationData.step2.district,
        registrationData.step2.state,
        registrationData.step2.pincode,
        registrationData.step3.studentContact,
        registrationData.step3.whatsappNumber,
        registrationData.step3.guardianContact,
        registrationData.step3.email,
        registrationData.step3.familyIncome,
        registrationData.step4.aadhaar,
        registrationData.step4.isPWD,
        registrationData.step4.isGovtEmployee,
        photoUrl,
      ];

      // Append to Google Sheet
      await appendToSheet(GOOGLE_SHEET_ID, sheetRow);

      res.json({ success: true, message: "Registration submitted successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to submit registration" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
