import { 
  users, 
  attendanceRecords,
  type User, 
  type InsertUser,
  type AttendanceRecord,
  type InsertAttendanceRecord
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByContact(contact: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveOtp(mobileNumber: string, otp: string): Promise<void>;
  getOtp(mobileNumber: string): Promise<string | undefined>;
  deleteOtp(mobileNumber: string): Promise<void>;
  createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  getAttendanceRecords(userId: string): Promise<AttendanceRecord[]>;
  getAttendanceStats(userId: string): Promise<{ total: number; percentage: number }>;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
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
