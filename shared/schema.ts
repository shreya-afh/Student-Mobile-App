import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Step 1 - Personal Information
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  guardianName: text("guardian_name").notNull(),
  guardianOccupation: text("guardian_occupation").notNull(),
  dateOfBirth: text("date_of_birth").notNull(), // Stored as JSON string
  
  // Step 2 - Education & Location
  collegeName: text("college_name").notNull(),
  course: text("course").notNull(),
  startYear: text("start_year").notNull(),
  endYear: text("end_year").notNull(),
  city: text("city").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  
  // Step 3 - Contact & Income
  studentContact: text("student_contact").notNull().unique(),
  whatsappNumber: text("whatsapp_number").notNull(),
  guardianContact: text("guardian_contact").notNull(),
  email: text("email").notNull(),
  familyIncome: text("family_income").notNull(),
  
  // Step 4 - Verification
  aadhaar: text("aadhaar").notNull(),
  isPWD: text("is_pwd").notNull(),
  isGovtEmployee: text("is_govt_employee").notNull(),
  selfieUrl: text("selfie_url"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
