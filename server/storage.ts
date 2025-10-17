import { 
  users, 
  attendanceRecords,
  offerLetters,
  courses,
  type User, 
  type InsertUser,
  type AttendanceRecord,
  type InsertAttendanceRecord,
  type OfferLetter,
  type InsertOfferLetter,
  type Course
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { generateAFHId } from "./utils/id-generator";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByContact(contact: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;
  saveOtp(mobileNumber: string, otp: string): Promise<void>;
  getOtp(mobileNumber: string): Promise<string | undefined>;
  deleteOtp(mobileNumber: string): Promise<void>;
  createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  getAttendanceRecords(userId: string): Promise<AttendanceRecord[]>;
  getAttendanceStats(userId: string): Promise<{ total: number; percentage: number }>;
  createOfferLetter(offer: InsertOfferLetter): Promise<OfferLetter>;
  getOfferLetters(userId: string): Promise<OfferLetter[]>;
  getOfferLetter(id: string): Promise<OfferLetter | undefined>;
  acceptOfferLetter(id: string): Promise<void>;
  rejectOfferLetter(id: string): Promise<void>;
  getCourseByCode(courseCode: string): Promise<Course | undefined>;
  getCourseById(courseId: string): Promise<Course | undefined>;
  enrollUserInCourse(userId: string, courseId: string): Promise<void>;
}

// DatabaseStorage uses PostgreSQL for persistent data
export class DatabaseStorage implements IStorage {
  private otps: Map<string, { otp: string; timestamp: number }>;

  constructor() {
    this.otps = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByContact(contact: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.studentContact, contact));
    return user || undefined;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.studentContact, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = await generateAFHId();
    const [user] = await db
      .insert(users)
      .values({ ...insertUser, id })
      .returning();
    return user;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));
  }

  async saveOtp(mobileNumber: string, otp: string): Promise<void> {
    // Clean up expired OTPs before saving new one
    this.cleanupExpiredOtps();
    this.otps.set(mobileNumber, { otp, timestamp: Date.now() });
  }

  async getOtp(mobileNumber: string): Promise<string | undefined> {
    const otpData = this.otps.get(mobileNumber);
    if (!otpData) return undefined;
    
    // OTP expires after 10 minutes
    const tenMinutes = 10 * 60 * 1000;
    if (Date.now() - otpData.timestamp > tenMinutes) {
      this.otps.delete(mobileNumber);
      return undefined;
    }
    
    return otpData.otp;
  }

  async deleteOtp(mobileNumber: string): Promise<void> {
    this.otps.delete(mobileNumber);
  }

  async createAttendanceRecord(insertRecord: InsertAttendanceRecord): Promise<AttendanceRecord> {
    const [record] = await db
      .insert(attendanceRecords)
      .values(insertRecord)
      .returning();
    return record;
  }

  async getAttendanceRecords(userId: string): Promise<AttendanceRecord[]> {
    const records = await db
      .select()
      .from(attendanceRecords)
      .where(eq(attendanceRecords.userId, userId))
      .orderBy(desc(attendanceRecords.createdAt));
    return records;
  }

  async getAttendanceStats(userId: string): Promise<{ total: number; percentage: number }> {
    const records = await this.getAttendanceRecords(userId);
    const total = records.length;
    // Mock calculation: assuming 60 total sessions possible
    const totalSessions = 60;
    const percentage = totalSessions > 0 ? Math.round((total / totalSessions) * 100) : 0;
    return { total, percentage };
  }

  async createOfferLetter(insertOffer: InsertOfferLetter): Promise<OfferLetter> {
    const [offer] = await db
      .insert(offerLetters)
      .values(insertOffer)
      .returning();
    return offer;
  }

  async getOfferLetters(userId: string): Promise<OfferLetter[]> {
    const offers = await db
      .select()
      .from(offerLetters)
      .where(eq(offerLetters.userId, userId))
      .orderBy(desc(offerLetters.createdAt));
    return offers;
  }

  async getOfferLetter(id: string): Promise<OfferLetter | undefined> {
    const [offer] = await db.select().from(offerLetters).where(eq(offerLetters.id, id));
    return offer || undefined;
  }

  async acceptOfferLetter(id: string): Promise<void> {
    await db
      .update(offerLetters)
      .set({ status: "accepted" })
      .where(eq(offerLetters.id, id));
  }

  async rejectOfferLetter(id: string): Promise<void> {
    await db
      .update(offerLetters)
      .set({ status: "rejected" })
      .where(eq(offerLetters.id, id));
  }

  async getCourseByCode(courseCode: string): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.courseCode, courseCode));
    return course || undefined;
  }

  async getCourseById(courseId: string): Promise<Course | undefined> {
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));
    return course || undefined;
  }

  async enrollUserInCourse(userId: string, courseId: string): Promise<void> {
    await db
      .update(users)
      .set({ courseId })
      .where(eq(users.id, userId));
  }

  private cleanupExpiredOtps(): void {
    const tenMinutes = 10 * 60 * 1000;
    const now = Date.now();
    Array.from(this.otps.entries()).forEach(([mobileNumber, otpData]) => {
      if (now - otpData.timestamp > tenMinutes) {
        this.otps.delete(mobileNumber);
      }
    });
  }
}

export const storage = new DatabaseStorage();
