import { z } from "zod";

export const attendanceQRSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  courseId: z.string().min(1, "Course ID is required"),
  session: z.string().min(1, "Session name is required"),
  course: z.string().min(1, "Course name is required"),
  date: z.string().min(1, "Date is required"),
  classDuration: z.number().default(2),
  mode: z.enum(["online", "offline"], { 
    errorMap: () => ({ message: "Mode must be either 'online' or 'offline'" })
  }),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }).optional(),
  timestamp: z.number().optional(),
}).refine(
  (data) => {
    if (data.mode === "offline" && !data.location) {
      return false;
    }
    return true;
  },
  {
    message: "Location is required for offline sessions",
    path: ["location"],
  }
);

export type AttendanceQRData = z.infer<typeof attendanceQRSchema>;

export function validateAttendanceQR(data: unknown): { 
  success: true; 
  data: AttendanceQRData;
} | { 
  success: false; 
  error: string;
} {
  const result = attendanceQRSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    const firstError = result.error.errors[0];
    return { 
      success: false, 
      error: firstError?.message || "Invalid QR code format" 
    };
  }
}
