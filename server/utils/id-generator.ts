import { db } from "../db";
import { sql } from "drizzle-orm";

/**
 * Generates a unique AFH student ID in the format AFH-XXXXXX
 * where XXXXXX is a 6-digit number padded with zeros
 * Uses a PostgreSQL sequence to ensure thread-safe unique ID generation
 */
export async function generateAFHId(): Promise<string> {
  // Create sequence if it doesn't exist (idempotent operation)
  await db.execute(sql`
    CREATE SEQUENCE IF NOT EXISTS afh_id_seq START WITH 1
  `);

  // Get the next value from the sequence (thread-safe)
  const result = await db.execute(sql`
    SELECT nextval('afh_id_seq') as next_id
  `);

  const nextNumber = Number(result.rows[0].next_id);

  // Format the number with leading zeros to make it 6 digits
  const paddedNumber = nextNumber.toString().padStart(6, '0');
  return `AFH-${paddedNumber}`;
}
