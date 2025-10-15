import { db } from "../db";
import { users } from "@shared/schema";
import { sql } from "drizzle-orm";

/**
 * Generates a unique AFH student ID in the format AFH-XXXXXX
 * where XXXXXX is a 6-digit number padded with zeros
 */
export async function generateAFHId(): Promise<string> {
  // Get the highest existing AFH ID number from the database
  const result = await db.execute(sql`
    SELECT id FROM users 
    WHERE id LIKE 'AFH-%' 
    ORDER BY id DESC 
    LIMIT 1
  `);

  let nextNumber = 1;

  if (result.rows.length > 0) {
    const lastId = result.rows[0].id as string;
    const lastNumber = parseInt(lastId.replace('AFH-', ''), 10);
    nextNumber = lastNumber + 1;
  }

  // Format the number with leading zeros to make it 6 digits
  const paddedNumber = nextNumber.toString().padStart(6, '0');
  return `AFH-${paddedNumber}`;
}
