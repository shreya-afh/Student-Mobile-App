import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { uploadToDrive, appendToSheet } from "./google-api";

const upload = multer({ storage: multer.memoryStorage() });

const GOOGLE_DRIVE_FOLDER_ID = "1V6PmBGmLBp-FJKH6xSUYEeYAsDr28EZN";
const GOOGLE_SHEET_ID = "1IzB51OMk0R14D_AoHy1aJxNZ5myY05eHMx-Y3bQnjoE";

export async function registerRoutes(app: Express): Promise<Server> {
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
