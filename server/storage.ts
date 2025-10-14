import { users, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByContact(contact: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveOtp(mobileNumber: string, otp: string): Promise<void>;
  getOtp(mobileNumber: string): Promise<string | undefined>;
  deleteOtp(mobileNumber: string): Promise<void>;
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
