import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey(),
  courseCode: text("course_code").notNull().unique(),
  courseName: text("course_name").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  startDate: text("start_date").notNull(),
  mode: text("mode").notNull(), // "Online" or "Offline"
  trainerName: text("trainer_name").notNull(),
  totalCapacity: integer("total_capacity").notNull(),
  enrolledCount: integer("enrolled_count").notNull().default(0),
  modules: text("modules").notNull(), // JSON string array
  totalClassHours: integer("total_class_hours").notNull().default(60), // Total course hours
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  
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
  
  // Authentication
  password: text("password").notNull(),
  
  // Course Enrollment
  courseId: varchar("course_id").references(() => courses.id),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const attendanceRecords = pgTable("attendance_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Session Information
  sessionId: text("session_id").notNull(),
  courseId: text("course_id").notNull(),
  sessionName: text("session_name").notNull(),
  courseName: text("course_name").notNull(),
  sessionDate: text("session_date").notNull(),
  classDuration: integer("class_duration").notNull().default(2), // Duration in hours
  
  // Mode & Location
  mode: text("mode").notNull(), // "online" or "offline"
  locationLat: text("location_lat"),
  locationLong: text("location_long"),
  locationAddress: text("location_address"),
  
  // Feedback
  rating: integer("rating").notNull(),
  feedback: text("feedback"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAttendanceRecordSchema = createInsertSchema(attendanceRecords).omit({
  id: true,
  createdAt: true,
});

export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;

export const offerLetters = pgTable("offer_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  
  // Offer Type: "received" (from company) or "uploaded" (by student)
  type: text("type").notNull(),
  
  // Employer Details
  company: text("company").notNull(),
  position: text("position").notNull(),
  jobType: text("job_type"), // 1=Full-time, 2=Part-time, 3=Contract, 4=Internship, 5=Apprenticeship, 6=Self-employed
  
  // Placement Location
  placementLocationType: text("placement_location_type"), // 1=Rural, 2=Urban, 3=Semi-Urban
  placementState: text("placement_state"),
  placementDistrict: text("placement_district"),
  placementCity: text("placement_city"),
  location: text("location"), // Legacy field for received offers
  
  // Joining Details
  joiningDate: text("joining_date"), // DD-MM-YYYY
  salary: text("salary"), // Annual Salary in INR (CTC)
  joiningStatus: text("joining_status"), // 1=Joined, 2=Will be joining, 3=Considering another offer, 4=Considering Higher Education
  
  // Status: "pending", "accepted", "rejected"
  status: text("status").notNull().default("pending"),
  
  // File Information
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type"),
  
  // Additional Details (for received offers)
  receivedDate: text("received_date"),
  deadlineDate: text("deadline_date"),
  description: text("description"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOfferLetterSchema = createInsertSchema(offerLetters).omit({
  id: true,
  createdAt: true,
});

export type InsertOfferLetter = z.infer<typeof insertOfferLetterSchema>;
export type OfferLetter = typeof offerLetters.$inferSelect;
