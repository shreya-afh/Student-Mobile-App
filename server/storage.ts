import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveOtp(mobileNumber: string, otp: string): Promise<void>;
  getOtp(mobileNumber: string): Promise<string | undefined>;
  deleteOtp(mobileNumber: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private otps: Map<string, { otp: string; timestamp: number }>;

  constructor() {
    this.users = new Map();
    this.otps = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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

export const storage = new MemStorage();
