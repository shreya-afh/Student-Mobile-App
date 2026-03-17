# AFH Student App — Exhaustive Technical Documentation

> **Purpose:** This document contains everything needed to rebuild the AFH (AspireForHer) Student App from scratch in any native mobile stack. It covers every screen, every field, every API endpoint, the full database schema, all business logic, all third-party integrations, and all configuration values.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Environment Variables / Secrets](#3-environment-variables--secrets)
4. [Database Schema](#4-database-schema)
5. [API Endpoints](#5-api-endpoints)
6. [Auth & Session Management](#6-auth--session-management)
7. [Navigation Structure](#7-navigation-structure)
8. [Screen-by-Screen Reference](#8-screen-by-screen-reference)
   - [8.1 Landing](#81-landing)
   - [8.2 Login](#82-login)
   - [8.3 Forgot Password](#83-forgot-password)
   - [8.4 Registration Step 1 — Personal Information](#84-registration-step-1--personal-information)
   - [8.5 Registration Step 2 — College & Education Details](#85-registration-step-2--college--education-details)
   - [8.6 Registration Step 3 — Contact & Income](#86-registration-step-3--contact--income)
   - [8.7 Registration Step 4 — Verification Details](#87-registration-step-4--verification-details)
   - [8.8 OTP Verification (VerifyOTP)](#88-otp-verification-verifyotp)
   - [8.9 Course Enrollment](#89-course-enrollment)
   - [8.10 Dashboard (Home)](#810-dashboard-home)
   - [8.11 Attendance — Step 1: QR Scan](#811-attendance--step-1-qr-scan)
   - [8.12 Attendance — Step 2: Session Information](#812-attendance--step-2-session-information)
   - [8.13 Attendance — Step 3: Feedback](#813-attendance--step-3-feedback)
   - [8.14 Attendance History](#814-attendance-history)
   - [8.15 Job Offers](#815-job-offers)
   - [8.16 Job Opportunities](#816-job-opportunities)
   - [8.17 Certificates](#817-certificates)
   - [8.18 Profile (My Profile)](#818-profile-my-profile)
9. [Third-Party Integrations](#9-third-party-integrations)
   - [9.1 Google Drive](#91-google-drive)
   - [9.2 Google Sheets](#92-google-sheets)
   - [9.3 Gupshup SMS OTP](#93-gupshup-sms-otp)
10. [Business Logic Notes](#10-business-logic-notes)
11. [QR Code Format for Attendance](#11-qr-code-format-for-attendance)
12. [Android Build Instructions](#12-android-build-instructions)
13. [Color Palette & Branding](#13-color-palette--branding)
14. [Known Limitations / Mock Data](#14-known-limitations--mock-data)

---

## 1. Project Overview

**App Name:** AFH Student App (AspireForHer × Infosys Foundation)
**App Type:** Capacitor-based hybrid mobile app (wraps a React/Vite web app into a native Android APK)
**User Base:** Female students enrolled in vocational/skilling programs
**Program:** Career Transformation Program — a joint Infosys Foundation × AspireForHer initiative

**Core capabilities:**
- Student self-registration (4 steps, OTP-verified)
- Course enrollment via a course code
- QR-based attendance marking (3-step flow with location verification for offline sessions)
- Attendance history and progress tracking
- Job offer letter upload and management
- Job opportunities browsing
- Certificates view
- Student profile view
- Google Sheets reporting (one row per student registration)
- Google Drive file storage (selfies, offer letters)

---

## 2. Tech Stack

### Frontend (Mobile App)
| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Mobile wrapper | Capacitor (Android/iOS bridge) |
| Routing | wouter |
| State / Data fetching | TanStack Query v5 |
| UI components | shadcn/ui + Tailwind CSS |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Native camera | @capacitor/camera |
| Native geolocation | @capacitor/geolocation |
| QR scanning | html5-qrcode (via QRScanner component) |
| Font | Inter (Google Fonts) |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | Express.js |
| ORM | Drizzle ORM |
| Database | PostgreSQL |
| File uploads | multer (in-memory storage) |
| Password hashing | bcrypt (10 salt rounds) |
| Validation | Zod |

### Infrastructure
| Concern | Solution |
|---|---|
| Hosting | Replit (dev), can be deployed anywhere |
| Database | Replit PostgreSQL (production uses same DB connection string) |
| File storage | Google Drive via googleapis |
| Reporting | Google Sheets via googleapis |
| SMS | Gupshup Enterprise SMS Gateway |

---

## 3. Environment Variables / Secrets

All secrets are stored as environment variables (never hardcoded).

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Yes | Full JSON of Google service account credentials (stringified). Must include `client_email` and `private_key`. Scopes needed: `spreadsheets`, `drive` |
| `GUPSHUP_API_KEY` | Yes (prod) | Gupshup Enterprise API key / password |
| `GUPSHUP_USER_ID` | Yes (prod) | Gupshup Enterprise user ID |
| `DLT_PRINCIPAL_ENTITY_ID` | Yes (prod) | DLT principal entity ID for Indian SMS compliance |
| `NODE_ENV` | Optional | Set to `development` to skip SMS sending and log OTPs to console |

**Hardcoded constants in server code (not secrets):**
```
GOOGLE_DRIVE_FOLDER_ID = "0APKlsIj58AdeUk9PVA"
GOOGLE_SHEET_ID        = "1IzB51OMk0R14D_AoHy1aJxNZ5myY05eHMx-Y3bQnjoE"
DLT_TEMPLATE_ID        = "1207167325073593251"
SMS_SENDER_MASK        = "AspFoH"
```

---

## 4. Database Schema

### 4.1 Table: `courses`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | varchar | PRIMARY KEY | Set manually (UUID or custom) |
| `course_code` | text | NOT NULL, UNIQUE | e.g. "DM2024B4". Searched via `/api/courses/search/:code` |
| `course_name` | text | NOT NULL | Display name |
| `description` | text | NOT NULL | Course description |
| `duration` | text | NOT NULL | e.g. "3 months" |
| `start_date` | text | NOT NULL | Display string e.g. "Jan 2025" |
| `mode` | text | NOT NULL | `"Online"` or `"Offline"` |
| `trainer_name` | text | NOT NULL | |
| `total_capacity` | integer | NOT NULL | Max students |
| `enrolled_count` | integer | NOT NULL, DEFAULT 0 | Current enrolled count |
| `modules` | text | NOT NULL | JSON string array e.g. `'["SEO", "Social Media"]'` |
| `total_class_hours` | integer | NOT NULL, DEFAULT 60 | Used for progress % calculation |
| `created_at` | timestamp | DEFAULT NOW() | |

### 4.2 Table: `users`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | varchar | PRIMARY KEY | Format: `AFH-XXXXXXX` (7-digit zero-padded). Generated via PostgreSQL sequence `afh_id_seq` |
| `full_name` | text | NOT NULL | |
| `gender` | text | NOT NULL | `"Male"`, `"Female"`, or `"Other"` |
| `guardian_name` | text | NOT NULL | |
| `guardian_occupation` | text | NOT NULL | |
| `date_of_birth` | text | NOT NULL | Stored as JSON string: `{"day":"12","month":"06","year":"1998"}` |
| `college_name` | text | NOT NULL | Selected from a dropdown list (college list in app) |
| `course` | text | NOT NULL | Highest qualification course name (text input) |
| `start_year` | text | NOT NULL | Academic start year (text) |
| `end_year` | text | NOT NULL | Academic end year (text) |
| `city` | text | NOT NULL | |
| `district` | text | NOT NULL | |
| `state` | text | NOT NULL | Indian state |
| `pincode` | text | NOT NULL | 6-digit string |
| `student_contact` | text | NOT NULL, UNIQUE | 10-digit mobile number (used as login username) |
| `whatsapp_number` | text | NOT NULL | May be same as student_contact |
| `guardian_contact` | text | NOT NULL | |
| `email` | text | NOT NULL | |
| `family_income` | text | NOT NULL | Annual family income (text/dropdown value) |
| `aadhaar` | text | NOT NULL | 12-digit Aadhaar number (stored as plain text, no masking in DB) |
| `is_pwd` | text | NOT NULL | `"Yes"` or `"No"` |
| `is_govt_employee` | text | NOT NULL | `"Yes"` or `"No"` (family member is govt employee) |
| `selfie_url` | text | NULLABLE | Google Drive webViewLink of selfie photo |
| `password` | text | NOT NULL | bcrypt hash (10 rounds) |
| `course_id` | varchar | FK → courses.id, NULLABLE | Null until student enrolls in a course |
| `created_at` | timestamp | DEFAULT NOW() | |

### 4.3 Table: `attendance_records`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | varchar | PRIMARY KEY, DEFAULT gen_random_uuid() | UUID |
| `user_id` | varchar | NOT NULL, FK → users.id | |
| `session_id` | text | NOT NULL | Session ID from QR code |
| `course_id` | text | NOT NULL | Course ID from QR code (matches users.course_id) |
| `session_name` | text | NOT NULL | Session name from QR code |
| `course_name` | text | NOT NULL | Course name from QR code |
| `session_date` | text | NOT NULL | Date string from QR code e.g. "2024-11-10" |
| `class_duration` | numeric(4,2) | NOT NULL, DEFAULT 2 | Hours (supports decimals like 1.5, 2.0) |
| `mode` | text | NOT NULL | `"online"` or `"offline"` |
| `location_lat` | text | NULLABLE | Student's GPS latitude (offline sessions) |
| `location_long` | text | NULLABLE | Student's GPS longitude (offline sessions) |
| `location_address` | text | NULLABLE | Address from QR code (offline sessions) |
| `rating` | integer | NOT NULL | 1–5 stars |
| `feedback` | text | NULLABLE | Free-text suggestions |
| `created_at` | timestamp | DEFAULT NOW() | |

### 4.4 Table: `offer_letters`

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | varchar | PRIMARY KEY, DEFAULT gen_random_uuid() | UUID |
| `user_id` | varchar | NOT NULL, FK → users.id | |
| `type` | text | NOT NULL | `"uploaded"` (by student) or `"received"` (from company, added externally) |
| `company` | text | NOT NULL | |
| `position` | text | NOT NULL | |
| `job_type` | text | NULLABLE | `"1"` = Full-time, `"2"` = Part-time, `"3"` = Contract, `"4"` = Internship, `"5"` = Apprenticeship, `"6"` = Self-employed |
| `placement_location_type` | text | NULLABLE | `"1"` = Rural, `"2"` = Urban, `"3"` = Semi-Urban |
| `placement_state` | text | NULLABLE | Indian state |
| `placement_district` | text | NULLABLE | |
| `placement_city` | text | NULLABLE | |
| `location` | text | NULLABLE | Legacy single-string location (for `type="received"` offers) |
| `joining_date` | text | NULLABLE | Format: `DD-MM-YYYY` |
| `salary` | text | NULLABLE | Annual CTC in INR (free text) |
| `joining_status` | text | NULLABLE | `"1"` = Joined, `"2"` = Will be joining, `"3"` = Considering another offer, `"4"` = Considering Higher Education |
| `status` | text | NOT NULL, DEFAULT `"pending"` | `"pending"`, `"accepted"`, or `"rejected"` |
| `file_name` | text | NOT NULL | Original filename of uploaded document |
| `file_url` | text | NOT NULL | Google Drive webViewLink |
| `file_type` | text | NULLABLE | MIME type |
| `received_date` | text | NULLABLE | ISO date string (YYYY-MM-DD) |
| `deadline_date` | text | NULLABLE | For received offers: respond-by date |
| `description` | text | NULLABLE | Additional notes (received offers) |
| `created_at` | timestamp | DEFAULT NOW() | |

### 4.5 PostgreSQL Sequence: `afh_id_seq`

Auto-created by the server on first registration. Generates strictly incrementing integers starting at 1. These are zero-padded to 7 digits and prefixed with `AFH-`.

```sql
CREATE SEQUENCE IF NOT EXISTS afh_id_seq START WITH 1;
SELECT nextval('afh_id_seq');  -- returns 1, 2, 3, ...
-- Result formatted as: AFH-0000001, AFH-0000002, ...
```

---

## 5. API Endpoints

All endpoints are on the same Express server. Base URL depends on environment (e.g., `http://localhost:5000` in dev, or the deployed domain in prod). No API-level authentication (auth is checked via localStorage on the client). All requests/responses are JSON unless noted.

### 5.1 OTP — Send

```
POST /api/send-otp
Content-Type: application/json

Request body:
{
  "mobileNumber": "9876543210"   // 10-digit (without country code) or with 91 prefix
}

Response 200:
{ "success": true, "message": "OTP sent successfully" }

Response 500 (SMS failure):
{ "success": false, "message": "Failed to send SMS. Please try again." }

Response 500 (not configured):
{ "success": false, "message": "SMS service not configured" }
```

**Behavior:**
- Generates a random 5-digit OTP (`10000`–`99999`)
- Stores OTP in-memory (`Map<mobileNumber, {otp, timestamp}>`) with 10-minute expiry
- If `GUPSHUP_API_KEY`, `GUPSHUP_USER_ID`, `DLT_PRINCIPAL_ENTITY_ID` are all set → sends real SMS via Gupshup
- If `NODE_ENV === "development"` and credentials are missing → logs OTP to console, returns success
- In production without credentials → returns 500

### 5.2 OTP — Verify

```
POST /api/verify-otp
Content-Type: application/json

Request body:
{
  "mobileNumber": "9876543210",
  "otp": "12345"
}

Response 200:
{ "success": true, "message": "OTP verified successfully" }

Response 400 (expired):
{ "success": false, "message": "OTP has expired. Please request a new one.", "errorType": "expired" }

Response 400 (invalid):
{ "success": false, "message": "Invalid OTP. Please check and try again.", "errorType": "invalid" }
```

**Note:** OTP is NOT deleted on verify. It stays so it can be reused for the password reset confirmation.

### 5.3 Phone Check

```
POST /api/check-phone
Content-Type: application/json

Request body:
{ "phoneNumber": "9876543210" }

Response 200:
{ "success": true, "exists": true }   // or false
```

Used during Step 3 of registration to prevent duplicate registrations.

### 5.4 Registration

```
POST /api/register
Content-Type: multipart/form-data

Form fields:
  - data (string): JSON string containing all registration fields
  - selfie (file, optional): selfie image (JPEG)

JSON structure of `data`:
{
  "step1": {
    "fullName": "Jane Doe",
    "gender": "Female",
    "guardianName": "John Doe",
    "guardianOccupation": "Farmer",
    "dateOfBirth": { "day": "12", "month": "06", "year": "1998" }
  },
  "step2": {
    "collegeName": "ABC College",
    "course": "B.Sc Computer Science",
    "startYear": "2020",
    "endYear": "2023",
    "city": "Pune",
    "district": "Pune",
    "state": "Maharashtra",
    "pincode": "411001"
  },
  "step3": {
    "studentContact": "9876543210",
    "whatsappNumber": "9876543210",
    "guardianContact": "9123456789",
    "email": "jane@example.com",
    "familyIncome": "Below 1 Lakh"
  },
  "step4": {
    "aadhaar": "123456789012",
    "isPWD": "No",
    "isGovtEmployee": "No",
    "password": "mypassword"
  }
}

Response 200:
{ "success": true, "message": "Registration submitted successfully", "userId": "AFH-0000001" }

Response 500:
{ "success": false, "message": "<error message>" }
```

**Side effects:**
1. Selfie (if provided) → uploaded to Google Drive folder `0APKlsIj58AdeUk9PVA`, made publicly readable
2. User row inserted into `users` table with auto-generated `AFH-XXXXXXX` ID
3. One row appended to Google Sheet `1IzB51OMk0R14D_AoHy1aJxNZ5myY05eHMx-Y3bQnjoE` (see §9.2 for column order)
4. OTP deleted from in-memory store after successful registration

### 5.5 Login

```
POST /api/login
Content-Type: application/json

Request body:
{
  "mobileNumber": "9876543210",
  "password": "mypassword"
}

Response 200:
{
  "success": true,
  "user": {
    "id": "AFH-0000001",
    "fullName": "Jane Doe",
    "studentContact": "9876543210",
    "courseId": "course-uuid-or-null",
    ... (all user fields except password)
  }
}

Response 401:
{ "success": false, "message": "Invalid mobile number or password" }
```

### 5.6 Reset Password

```
POST /api/reset-password
Content-Type: application/json

Request body:
{
  "mobileNumber": "9876543210",
  "otp": "12345",
  "newPassword": "newpass123"
}

Response 200:
{ "success": true, "message": "Password reset successful" }

Response 401:
{ "success": false, "message": "Invalid or expired OTP" }

Response 404:
{ "success": false, "message": "User not found" }
```

**Side effects:** OTP deleted from in-memory store after successful reset.

### 5.7 Get User Profile

```
GET /api/user/:id

Response 200:
{ "success": true, "user": { ...all user fields... } }

Response 404:
{ "success": false, "message": "User not found" }
```

### 5.8 Save Attendance Record

```
POST /api/attendance
Content-Type: application/json

Request body:
{
  "userId": "AFH-0000001",
  "sessionId": "session-uuid",
  "courseId": "course-uuid",
  "sessionName": "Introduction to SEO",
  "courseName": "Digital Marketing Fundamentals",
  "sessionDate": "2024-11-10",
  "classDuration": 2,              // hours (number, default 2)
  "mode": "online",                // "online" or "offline"
  "locationLat": "18.5204",        // optional, offline only
  "locationLong": "73.8567",       // optional, offline only
  "locationAddress": "Pune, MH",   // optional, offline only
  "rating": 4,                     // 1–5
  "feedback": "Great session!"     // optional
}

Response 200:
{ "success": true, "message": "Attendance recorded successfully", "record": {...} }
```

### 5.9 Get Attendance Records

```
GET /api/attendance/:userId

Response 200:
{
  "success": true,
  "records": [
    {
      "id": "uuid",
      "userId": "AFH-0000001",
      "sessionId": "...",
      "courseId": "...",
      "sessionName": "...",
      "courseName": "...",
      "sessionDate": "2024-11-10",
      "classDuration": "2.00",
      "mode": "online",
      "locationLat": null,
      "locationLong": null,
      "locationAddress": null,
      "rating": 4,
      "feedback": "Great session!",
      "createdAt": "2024-11-10T..."
    },
    ...
  ]
}
```

Records are ordered by `created_at DESC`.

### 5.10 Get Attendance Stats

```
GET /api/attendance/stats/:userId

Response 200:
{
  "success": true,
  "stats": {
    "total": 12,           // total sessions attended
    "percentage": 20       // total / 60 * 100 (NOTE: denominator hardcoded to 60)
  }
}
```

**Note:** The `percentage` is calculated against a hardcoded assumption of 60 total sessions, not the actual course's `total_class_hours`.

### 5.11 Get Attendance Summary

```
GET /api/attendance/summary/:userId/:courseId

Response 200:
{
  "success": true,
  "summary": {
    "totalHoursAttended": 24.5,
    "totalSessions": 12
  }
}
```

Filters attendance records by matching `courseId`. `totalHoursAttended` is the sum of `classDuration` values for that course.

### 5.12 Upload Offer Letter

```
POST /api/offer-letters/upload
Content-Type: multipart/form-data

Form fields:
  - file (required): PDF or image file
  - data (string): JSON string

JSON structure of `data`:
{
  "userId": "AFH-0000001",
  "company": "TechCorp Solutions",
  "position": "Digital Marketing Executive",
  "jobType": "1",                       // 1=Full-time ... 6=Self-employed
  "placementLocationType": "2",         // 1=Rural, 2=Urban, 3=Semi-Urban
  "placementState": "Maharashtra",
  "placementDistrict": "Pune",
  "placementCity": "Pune",
  "joiningDate": "01-06-2025",          // DD-MM-YYYY
  "salary": "4,00,000",
  "joiningStatus": "2"                  // 1=Joined, 2=Will be joining, etc.
}

Response 200:
{ "success": true, "message": "Offer letter uploaded successfully", "offer": {...} }
```

**Side effects:** File uploaded to Google Drive folder `0APKlsIj58AdeUk9PVA`, made publicly readable. Row inserted in `offer_letters` with `type="uploaded"`.

### 5.13 Get Offer Letters

```
GET /api/offer-letters/:userId

Response 200:
{
  "success": true,
  "offers": [ ...array of offer_letter rows... ]
}
```

### 5.14 Accept Offer Letter

```
POST /api/offer-letters/:id/accept

Response 200:
{ "success": true, "message": "Offer accepted successfully" }
```

Sets `status = "accepted"` in DB.

### 5.15 Reject Offer Letter

```
POST /api/offer-letters/:id/reject

Response 200:
{ "success": true, "message": "Offer rejected successfully" }
```

Sets `status = "rejected"` in DB.

### 5.16 Search Course by Code

```
GET /api/courses/search/:courseCode

Response 200:
{ "success": true, "course": {...course fields...} }

Response 404:
{ "success": false, "message": "Course not found" }
```

Course code is normalized to UPPERCASE before lookup.

### 5.17 Get Course by ID

```
GET /api/courses/:courseId

Response 200:
{ "success": true, "course": {...course fields...} }

Response 404:
{ "success": false, "message": "Course not found" }
```

### 5.18 Enroll User in Course

```
POST /api/enroll
Content-Type: application/json

Request body:
{
  "userId": "AFH-0000001",
  "courseId": "course-uuid"
}

Response 200:
{ "success": true, "message": "Enrolled successfully" }

Response 400:
{ "success": false, "message": "User ID and Course ID are required" }
```

Updates `users.course_id` to the given `courseId`.

---

## 6. Auth & Session Management

### Storage
- **Key:** `afh_auth` in `localStorage`
- **Value (JSON):**
  ```json
  {
    "user": {
      "id": "AFH-0000001",
      "phone": "9876543210",
      "name": "Jane Doe",
      "courseId": "course-uuid-or-null"
    },
    "timestamp": "2024-11-10T10:30:00.000Z"
  }
  ```
- **No server-side sessions.** All auth is client-side via localStorage.
- **No automatic expiry** on the localStorage token — user stays logged in until they explicitly logout.

### Login Flow
1. User submits mobile + password → `POST /api/login`
2. On success, store `afh_auth` in localStorage and set `isAuthenticated = true`
3. If `courseId` is null → redirect to `/course-enrollment`
4. If `courseId` is set → redirect to `/dashboard`

### Logout Flow
1. Remove `afh_auth` from localStorage
2. Set `isAuthenticated = false`, `user = null`
3. Redirect to `/`

### Route Protection
- **ProtectedRoute:** Requires `isAuthenticated = true`. If not, redirect to `/login`. Wrapped in `AppLayout` (which includes BottomNav).
- **PublicRoute:** If already authenticated, redirect to `/dashboard`.
- Registration and verify-otp routes are neither — no guard.

### OTP In-Memory Store (Server-Side)
- `Map<mobileNumber, { otp: string, timestamp: number }>`
- OTP expires after **10 minutes** (`10 * 60 * 1000 ms`)
- Cleanup of expired entries happens on each `saveOtp()` call
- OTP is deleted:
  - After successful registration (`POST /api/register`)
  - After successful password reset (`POST /api/reset-password`)
  - NOT after `POST /api/verify-otp` (kept for the subsequent register/reset-password call)

---

## 7. Navigation Structure

### Bottom Navigation Bar (visible on all protected routes)

| Tab | Icon | Route | Active Logic |
|---|---|---|---|
| Home | Home | `/dashboard` | exact match |
| Attendance | ClipboardCheck | `/attendance` | starts with `/attendance` |
| Offers | Briefcase | `/job-offers` | starts with `/job-` |
| Profile | User | `/profile` | exact match |

Active tab color: `#6d10b0` (bold stroke)
Inactive tab color: `#697282` (regular stroke)
Bottom nav height: 64px (h-16)

### Full Route Table

| Route | Component | Guard | Notes |
|---|---|---|---|
| `/` | Landing | PublicRoute | Redirects to /dashboard if logged in |
| `/login` | Login | PublicRoute | |
| `/forgot-password` | ForgotPassword | None | |
| `/register/step1` | RegisterStep1 | None | |
| `/register/step2` | RegisterStep2 | None | |
| `/register/step3` | RegisterStep3 | None | |
| `/register/step4` | RegisterStep4 | None | |
| `/verify-otp` | VerifyOTP | None | |
| `/dashboard` | Dashboard | ProtectedRoute | Redirects to /course-enrollment if no courseId |
| `/course-enrollment` | CourseEnrollment | ProtectedRoute | Redirects to /dashboard if already enrolled |
| `/attendance` | AttendanceStep1 | ProtectedRoute | |
| `/attendance/mode` | AttendanceStep2 | ProtectedRoute | |
| `/attendance/feedback` | AttendanceStep3 | ProtectedRoute | |
| `/attendance-history` | AttendanceHistory | ProtectedRoute | |
| `/certificates` | Certificates | ProtectedRoute | |
| `/job-offers` | JobOffers | ProtectedRoute | |
| `/job-opportunities` | JobOpportunities | ProtectedRoute | |
| `/profile` | StudentMobileApp | ProtectedRoute | |

---

## 8. Screen-by-Screen Reference

Every screen has a **Logo Bar** at the very top: `Infosys Foundation logo × AspireForHer logo`, centered, on `#f8f9fa` background with bottom border.

---

### 8.1 Landing

**Route:** `/`  
**Auth Guard:** PublicRoute (auto-redirect to /dashboard if logged in)

**Layout:**
- Logo bar (large logos, h-20)
- Hero heading: "Career Transformation Program" (bold, `#1d2838`)
- Two CTAs (stacked, max-width ~360px):
  - "Start Your Journey" → navigates to `/register/step1` (primary, `#5C4C7D`)
  - "Login" → navigates to `/login` (outline, `#5C4C7D`)
- Stats row (3 items, centered):
  - 95% — Placement
  - 10K+ — Students
  - 500+ — Companies

**No API calls.**

---

### 8.2 Login

**Route:** `/login`  
**Auth Guard:** PublicRoute

**Fields:**
| Field | Type | Validation |
|---|---|---|
| Mobile Number | tel input | Required |
| Password | password input (toggle show/hide) | Required |

**CTAs:**
- "Forgot Password?" link → `/forgot-password`
- "Login" button (primary) → calls `POST /api/login`
- "Don't have an account? Register" → `/register/step1`

**Success behavior:**
- Stores `afh_auth` in localStorage with `{ id, phone: studentContact, name: fullName, courseId }`
- If `courseId` is null → redirects to `/course-enrollment`
- If `courseId` is set → redirects to `/dashboard`

**Error behavior:**
- Shows an AlertDialog popup ("Login Failed") with the error message and a "Try Again" button
- Does NOT redirect; user dismisses dialog and can retry

---

### 8.3 Forgot Password

**Route:** `/forgot-password`  
**Auth Guard:** None

**3-step internal flow (single route, no sub-routes):**

**Step 1 — Phone:**
- Field: Mobile Number (tel input, required)
- CTA: "Send OTP" → calls `POST /api/send-otp`
- On success → moves to Step 2

**Step 2 — OTP:**
- 5 individual digit input boxes (auto-advance to next box on input)
- 60-second countdown timer; "Resend OTP" button enabled when timer = 0
- CTA: "Verify OTP" → calls `POST /api/verify-otp`
- Auto-verifies when all 5 digits entered
- On success → moves to Step 3

**Step 3 — New Password:**
- Fields:
  - New Password (password input, show/hide toggle, min 6 chars)
  - Confirm Password (password input, show/hide toggle)
- Validation: passwords must match, min 6 chars
- CTA: "Reset Password" → calls `POST /api/reset-password`
- On success → toast "Password Reset Successful" + redirect to `/login`

---

### 8.4 Registration Step 1 — Personal Information

**Route:** `/register/step1`  
**Auth Guard:** None  
**Progress indicator:** "Step 1 of 4"

**Fields:**
| Field | Type | Validation |
|---|---|---|
| Full Name | text input | Required |
| Gender | toggle buttons (Male/Female/Other) | Required |
| Guardian's Name | text input | Required |
| Guardian's Occupation | text input | Required |
| Date of Birth | 3 linked dropdowns (Day/Month/Year) | All 3 required; Day auto-adjusts if selected day exceeds days in month; Year list goes back 100 years |

**CTA:** "Continue" → saves to RegistrationContext → navigates to `/register/step2`

**Back:** chevron left → navigates to `/`

**No API calls.**

---

### 8.5 Registration Step 2 — College & Education Details

**Route:** `/register/step2`  
**Auth Guard:** None  
**Progress indicator:** "Step 2 of 4"

**Fields:**
| Field | Type | Validation |
|---|---|---|
| College Name | Select dropdown | Required (list of Indian colleges seeded in app) |
| Highest Qualification Course | text input (or select) | Required |
| Start Year | numeric input | Required; must be ≤ current year |
| End Year | numeric input | Required; must be ≥ start year |
| State | Select (all Indian states from `shared/locationData`) | Required |
| District | Select (filtered by state) | Required |
| City | Select (filtered by district) + "Other" option | Required; if "Other" selected, shows text input |
| Pincode | text input | Required; must be exactly 6 digits |

**CTA:** "Continue" → validates → saves to RegistrationContext → navigates to `/register/step3`

**Back:** chevron left → `/register/step1`

**No API calls.**

---

### 8.6 Registration Step 3 — Contact & Income

**Route:** `/register/step3`  
**Auth Guard:** None  
**Progress indicator:** "Step 3 of 4"

**Fields:**
| Field | Type | Validation |
|---|---|---|
| Student Contact Number | tel input (max 10 digits, numeric only) | Required; must match `/^[6-9]\d{9}$/`; must not equal guardian contact |
| WhatsApp Number | tel input (max 10 digits) | Required; same validation as above; "Same as Contact" checkbox autofills from student contact |
| Guardian Contact Number | tel input (max 10 digits) | Required; must not equal student contact |
| Email | email input | Required |
| Annual Family Income | Select dropdown | Required |

**Family Income dropdown options** (exact values from app, displayed as labels):
- Below 1 Lakh, 1-2 Lakh, 2-3 Lakh, 3-5 Lakh, 5-10 Lakh, Above 10 Lakh
  *(These are the display labels; actual option values may match these strings)*

**"Same as Contact" checkbox:** Syncs WhatsApp Number with Student Contact in real-time.

**On "Continue":**
1. Validates phone format and uniqueness (student ≠ guardian)
2. Calls `POST /api/check-phone` with studentContact
3. If number already registered → shows error "This contact number is already registered. Please use a different number."
4. On pass → saves to RegistrationContext → navigates to `/register/step4`

**Back:** chevron left → `/register/step2`

---

### 8.7 Registration Step 4 — Verification Details

**Route:** `/register/step4`  
**Auth Guard:** None  
**Progress indicator:** "Step 4 of 4"

**Fields:**
| Field | Type | Validation |
|---|---|---|
| Aadhaar Number | tel input (type="tel", maxLength=12, numeric only stripped) | Required; must match `/^\d{12}$/` exactly; inline error if partial |
| PWD Status | toggle buttons (Yes/No) | Required |
| Is family member a Govt Employee? | toggle buttons (Yes/No) | Required |
| Live Picture (Selfie) | Camera capture button | Required; uses Capacitor Camera API (front camera, quality 90, CameraResultType.Uri) |
| Create Password | password input (show/hide toggle, min 6 chars) | Required |
| Confirm Password | password input (show/hide toggle) | Required; must match password |

**Aadhaar inline error messages:**
- "Aadhaar must be exactly 12 digits" (while typing, length < 12)
- "Enter a valid 12-digit Aadhaar number" (on submit)

**Selfie capture:** Opens device front camera. On capture, converts image URI to File object (JPEG). Shows "✓ Photo captured" text when done.

**CTA:** "Continue to Verification" → validates all fields → saves to RegistrationContext → navigates to `/verify-otp`

**Back:** chevron left → `/register/step3`

**No API calls on this page.**

---

### 8.8 OTP Verification (VerifyOTP)

**Route:** `/verify-otp`  
**Auth Guard:** None

**Behavior on mount:** Automatically calls `POST /api/send-otp` with the `studentContact` from RegistrationContext. Timer starts at 60 when OTP send succeeds.

**UI:**
- Instruction: "Enter the OTP sent to your phone"
- 5 individual digit input boxes (auto-advance)
- 60-second countdown timer
- "Resend OTP" button (enabled when timer = 0)

**On OTP entry (submit):**
1. Calls `POST /api/verify-otp`
2. If success → calls `POST /api/register` (multipart, all registration data + selfie file)
3. On registration success:
   - Toast: "Registration Successful — Reg. ID: AFH-XXXXXXX" (duration 5s)
   - Calls `login()` with `{ id: userId, phone: mobileNumber, name: fullName }` → stores `afh_auth` in localStorage
   - Calls `resetRegistration()` to clear RegistrationContext
   - Navigates to `/course-enrollment`

**On OTP error:**
- If `errorType === "expired"` → clears OTP inputs so user knows to resend
- Shows toast with the error message from the server

**Back:** chevron left → `/register/step4`

---

### 8.9 Course Enrollment

**Route:** `/course-enrollment`  
**Auth Guard:** ProtectedRoute  
**Auto-redirect:** If `user.courseId` is already set → immediately redirects to `/dashboard`

**UI:**
- Text input: "Course Code" (e.g. "DM2024B4")
- CTA: "Search Course" → normalizes code to UPPERCASE → calls `GET /api/courses/search/:courseCode`

**On course found:** Displays a course card with:
- Course Name (bold), Code, Mode badge (Online/Offline)
- Description
- Duration, Start Date, Capacity (enrolled/total), Mode
- Trainer Name
- Course Modules (bulleted list, parsed from JSON string)
- "Enroll Now" button → calls `POST /api/enroll` with userId and courseId

**On enroll success:**
- Updates AuthContext with new courseId via `login({ ...user, courseId })`
- Toast: "Enrollment Successful"
- Redirects to `/dashboard` after 100ms delay

**How-to info card** (always shown):
- "Contact your mobilization partner"
- "Attend information session"
- "Check SMS/WhatsApp messages"
- "Visit local AFH center"

---

### 8.10 Dashboard (Home)

**Route:** `/dashboard`  
**Auth Guard:** ProtectedRoute  
**Auto-redirect:** If `user.courseId` is null → redirects to `/course-enrollment`

**Header:**
- Logo bar
- "Welcome back!" (bold) on left; avatar (initials) on right → navigates to `/profile`; logout icon button
- Logout: removes `afh_auth`, redirects to `/`

**Current Course Card** (clickable → `/attendance-history`):
- Fetches `GET /api/courses/:courseId`
- Shows: Course Name, Trainer, Course Code badge
- Progress bar: `totalHoursAttended / totalClassHours * 100`%
- Attendance percentage stat
- Fetches `GET /api/attendance/summary/:userId/:courseId` for `totalHoursAttended`

**Quick Actions grid (2×2):**
| Label | Subtitle | Navigate to |
|---|---|---|
| Attendance and Feedback | Scan QR & rate your session | `/attendance` |
| Job Opportunities | Explore placement options | `/job-opportunities` |
| My Certificates | View earned certificates | `/certificates` |
| Job Offers | View job offers | `/job-offers` |

**Your Progress stats row (3 stats):**
| Stat | Value |
|---|---|
| Hours Completed | Real: `totalHoursAttended` |
| Certificates | Hardcoded: `2` |
| Attendance | Computed: `progressPercentage`% |

---

### 8.11 Attendance — Step 1: QR Scan

**Route:** `/attendance`  
**Auth Guard:** ProtectedRoute

**UI:**
- Info banner: "Feedback Required — Your feedback is mandatory to mark attendance. After scanning QR, you'll be asked to rate the session."
- Large dashed QR icon placeholder
- "Scan QR Code" button → opens QRScanner overlay

**QR Scanner overlay** (full-screen, uses html5-qrcode):
- Activates device camera, scans for QR codes
- On scan success → parses JSON from QR text
- Validates JSON against `attendance-schema` (`validateAttendanceQR`)
- If valid → stores parsed data in localStorage key `attendance_qr_data` → navigates to `/attendance/mode`
- If invalid → shows destructive toast, scanner stays open

**Back:** chevron left → `/dashboard`

---

### 8.12 Attendance — Step 2: Session Information

**Route:** `/attendance/mode`  
**Auth Guard:** ProtectedRoute

**On mount:**
1. Reads `attendance_qr_data` from localStorage
2. Validates against schema
3. Validates that `qrData.courseId === user.courseId`; if mismatch → toast "Wrong Course" + redirect to `/attendance`
4. If mode = `"offline"` → automatically triggers location verification

**Session Details card:**
- Session name, Date, Course name, Duration

**Mode card:**
- Online: Monitor icon, "Online Session", "Virtual classroom attendance"
- Offline: MapPin icon, "Offline Session", QR address or "Physical classroom attendance"

**Location Verification card (offline only):**
- Loading: spinner + "Checking your location..."
- Success: green check + "Location verified successfully"
- Failure: red alert + `"You are {N}m away from the session location. Please move closer."` + "Retry Location" button

**Location check logic:**
1. Checks/requests Capacitor Geolocation permission
2. Gets current GPS position (`enableHighAccuracy: true, timeout: 10000`)
3. Calculates Haversine distance to QR code's `location.latitude/longitude`
4. **Allowed distance: 1000 meters**
5. If within → verified; if not → failure

**CTA:** "Continue to Feedback"
- Enabled if: `mode === "online"` OR `locationVerified === true`
- Navigates to `/attendance/feedback`

**Back:** chevron left → `/attendance`

---

### 8.13 Attendance — Step 3: Feedback

**Route:** `/attendance/feedback`  
**Auth Guard:** ProtectedRoute

**On mount:** Reads and validates `attendance_qr_data` from localStorage. If missing → redirect to `/attendance`.

**Fields:**
| Field | Type | Required |
|---|---|---|
| Overall Session Rating | 5-star selector (tap to rate) | Yes (must be ≥ 1) |
| Suggestions | Textarea (min-height 100px) | No |

**CTA:** "Submit Feedback & Confirm Attendance"
- Disabled if `rating === 0`
- Calls `POST /api/attendance` with all session data + rating + feedback
- Also includes GPS data if available from QR

**On success:**
- Removes `attendance_qr_data` from localStorage
- Invalidates query caches for attendance records and summary
- Redirects to `/dashboard`

**Back:** chevron left → `/attendance/mode`

---

### 8.14 Attendance History

**Route:** `/attendance-history`  
**Auth Guard:** ProtectedRoute

Fetches `GET /api/attendance/:userId`.

**Per-record card:**
- Session Name (bold), Course Name, Rating (star icon + X/5)
- Date (calendar icon), Mode (monitor/mappin icon)
- Feedback text (if present, in quotes, below a divider)

**Empty state:** Calendar icon, "No Attendance Records", "You haven't attended any sessions yet" + "Mark Attendance" button → `/attendance`

**Error state:** Red card with error message + "Retry" button

**Back:** chevron left → `/dashboard`

---

### 8.15 Job Offers

**Route:** `/job-offers`  
**Auth Guard:** ProtectedRoute

Fetches `GET /api/offer-letters/:userId`.

**Upload section** (always visible at top):
- Blue-tinted info card: "Got a Job Offer? Upload your offer letter to confirm your placement."
- "Upload Offer Letter" button → opens upload Dialog

**Upload Dialog fields** (all required unless noted):
| Field | Type | Notes |
|---|---|---|
| Company Name | text input | |
| Position/Role | text input | |
| Job Type | Select | 1=Full-time, 2=Part-time, 3=Contract, 4=Internship, 5=Apprenticeship, 6=Self-employed |
| Placement Location Type | Select | 1=Rural, 2=Urban, 3=Semi-Urban |
| State | Select (Indian states) | |
| District | Select (by state) | |
| City | Select (by district) + "Other" option | If Other → text input appears |
| Joining Date — Day | Select | |
| Joining Date — Month | Select | |
| Joining Date — Year | Select | |
| Salary (Annual CTC in INR) | text input | |
| Joining Status | Select | 1=Joined, 2=Will be joining, 3=Considering another offer, 4=Considering Higher Education |
| Offer Letter File | file input (PDF/image) | |

Validation: All fields required. On failure → highlights missing fields red + scrolls to first error field + shows toast "Please fill in all required fields highlighted in red".

On submit → `POST /api/offer-letters/upload` (multipart). Joining date formatted as `DD-MM-YYYY`.

**Received Offers section:** Shows offers with `type = "received"`.  
**Uploaded Offers section:** Shows offers with `type = "uploaded"`.

**Per-offer card:**
- Position (bold), Company, Status badge (pending=amber, accepted=green, rejected=red)
- Location and Salary icons (if present)
- For received offers: "Awaiting Your Decision" banner with deadline, or "Offer Accepted" banner with joining date
- View Letter link → opens `fileUrl` in browser tab
- For pending received offers: "Reject" (outline, red) and "Accept" (primary) buttons

**Reject confirmation:** AlertDialog — "Are you sure you want to reject this offer?" with Cancel and Confirm buttons.

**Accept:** Calls `POST /api/offer-letters/:id/accept`  
**Reject:** Calls `POST /api/offer-letters/:id/reject`

**Back:** chevron left → `/dashboard`

---

### 8.16 Job Opportunities

**Route:** `/job-opportunities`  
**Auth Guard:** ProtectedRoute

> ⚠️ **All job listings are hardcoded static data — not DB-driven.**

**Header tabs:**
- Available Jobs (N) | Applied (N)

**Search bar:** Filters jobs by title, company, or skill (client-side).

**Static job listings (hardcoded):**
1. Digital Marketing Executive — TechCorp Solutions, Bangalore, ₹3-4 LPA, Full-time, Skills: SEO/Social Media/Content/+1
2. Social Media Intern — Creative Agency, Mumbai, ₹15,000/month, Internship, Skills: Social Media/Content/Communication
3. Content Creator — Digital First Media, Delhi NCR, ₹2-3 LPA, Part-time, Skills: Content Writing/Design/Social Media

**Job type badge colors:**
- Full-time: `#eff1ff` bg / `#5C4C7D` text
- Internship: `#fef3c7` bg / `#92400e` text
- Part-time: `#f0fdf4` bg / `#166534` text

**Apply behavior (client-side only, no API call):**
1. Moves job from "Available" tab to "Applied" tab
2. Shows toast "Application Submitted"
3. Shows brief green "Application Submitted Successfully" card (fades out after ~3s)

**Back:** chevron left → `/dashboard`

---

### 8.17 Certificates

**Route:** `/certificates`  
**Auth Guard:** ProtectedRoute

> ⚠️ **All certificate data is hardcoded/mock — not DB-driven.**

**Stats row (3 cards, hardcoded):**
- Earned: 1 | In Progress: 1 | Pending: 1

**Sections:**

**Earned Certificates:**
- Basic Computer Skills / Computer Literacy Program
- Badge: "Earned" (green)
- Issued: 10 Nov 2024, ID: AFH-CS-2024-001123
- Actions: Download (generates .txt file) | Share (Web Share API or clipboard fallback)

**In Progress:**
- Digital Marketing Fundamentals
- Badge: "In Progress" (blue)
- Progress: 39/60 hours, 65% complete
- ID: AFH-DM-2024-001234

**Pending:**
- Advanced Excel Training / Microsoft Office Suite
- Badge: "Pending" (outline)
- Progress: 10/30 hours, 33% complete
- ID: AFH-EX-2024-001235

**About AFH Certificates info card:**
- Certificates issued after 60 learning hours
- Digitally signed and verifiable
- Share on social media
- Use for job applications

**Download behavior:** Generates a `.txt` file with certificate text and saves it locally. Certificate ID is randomly generated at download time.

**Back:** chevron left → `/dashboard`

---

### 8.18 Profile (My Profile)

**Route:** `/profile`  
**Auth Guard:** ProtectedRoute

Fetches `GET /api/user/:id`.

**Profile header card:**
- Avatar: circular initials (first letter of first name + first letter of last name), `#eff1ff` bg, `#5C4C7D` text
- Full Name, Email
- Badges: "Student" (purple tint), "Verified" (green outline)

**Stats grid (2×2, hardcoded):**
- 1 — Courses Completed
- 39 — Hours Learned
- 2 — Certificates
- 92% — Attendance Rate

> ⚠️ These stats are hardcoded, not pulled from real data.

**Personal Information card:**
- Registration ID (users.id)
- Full Name
- Email Address
- Phone Number
- Address (`city, district, state - pincode`)
- Education (`course at collegeName`)

**Guardian Information card:**
- Guardian Name
- Occupation
- Contact Number

**Settings menu (navigation cards):**
- Privacy & Security (no action implemented)
- App Settings (no action implemented)
- Help & Support (no action implemented)
- Logout (red text) → calls `logout()` → removes localStorage → navigates to `/`

**App version footer:**
- "AFH Student App v1.0.0"
- "© 2025 AFH. All rights reserved."

**Back:** chevron left → `/dashboard`

---

## 9. Third-Party Integrations

### 9.1 Google Drive

**Library:** `googleapis` (Node.js)  
**Auth method:** Service Account JWT  
**Credentials env var:** `GOOGLE_SERVICE_ACCOUNT_JSON` (full JSON as string, must have `client_email` and `private_key`)  
**OAuth scopes:**
- `https://www.googleapis.com/auth/drive`
- `https://www.googleapis.com/auth/spreadsheets`

**Folder ID (hardcoded):** `0APKlsIj58AdeUk9PVA`

**Upload function:**
```
uploadToDrive(fileBuffer: Buffer, fileName: string, mimeType: string, folderId: string): Promise<string>
```

Steps:
1. Creates JWT auth client
2. Calls `drive.files.create` with file metadata + media body (stream from buffer)
3. Calls `drive.permissions.create` to set `role: "reader"`, `type: "anyone"` (publicly readable)
4. Returns `response.data.webViewLink` (fallback: `https://drive.google.com/file/d/{id}/view`)

Files uploaded:
- Student selfies: `{FullName}_{timestamp}.jpg`
- Offer letters: `{company}_{position}_{timestamp}.{ext}`

### 9.2 Google Sheets

**Sheet ID (hardcoded):** `1IzB51OMk0R14D_AoHy1aJxNZ5myY05eHMx-Y3bQnjoE`  
**Range:** `Sheet1!A:Z`  
**Value input option:** `USER_ENTERED`

**Column order for registration row (28 columns):**

| Column # | Field | Source |
|---|---|---|
| A | AFH Student ID | `user.id` (e.g. `AFH-0000001`) |
| B | Aadhaar No | `step4.aadhaar` |
| C | Enrollment Date | Today's date as `DD/MM/YYYY` |
| D | Name | `step1.fullName` |
| E | Age | Calculated from DOB at registration time |
| F | Gender | `step1.gender` |
| G | Contact | `step3.studentContact` |
| H | State | `step2.state` |
| I | District | `step2.district` |
| J | City | `step2.city` |
| K | College Name | `step2.collegeName` |
| L | Highest Qualification Course | `step2.course` |
| M | Annual Family Income in INR | `step3.familyIncome` |
| N | Centre Name | empty string |
| O | Training Location District Name | empty string |
| P | Training Location City Name | empty string |
| Q | Date of Birth | `DD/MM/YYYY` formatted from step1.dateOfBirth |
| R | Email ID | `step3.email` |
| S | Parent/Guardian Name | `step1.guardianName` |
| T | Parent/Guardian Phone Number | `step3.guardianContact` |
| U | Parent/Guardian Occupation | `step1.guardianOccupation` |
| V | Beneficiary Work Experience (Years) | empty string |
| W | Enrollment Status | empty string |
| X | System Generated Course ID | empty string |
| Y | Batch ID | empty string |
| Z | Onboarding Source | empty string |
| AA | PWD (Status) | `step4.isPWD` |
| AB | Is a family member govt. employee? | `step4.isGovtEmployee` |
| AC | Selfie URL | Google Drive webViewLink (or null) |

### 9.3 Gupshup SMS OTP

**API Endpoint:** `https://enterprise.smsgupshup.com/GatewayAPI/rest`  
**Method:** POST  
**Content-Type:** `application/x-www-form-urlencoded`

**Parameters:**
| Param | Value |
|---|---|
| method | `SendMessage` |
| send_to | `91{mobileNumber}` (with country code 91) |
| msg | `OTP is {otp} for Aspire For Her. Do not share the OTP for security reasons` |
| msg_type | `Text` |
| userid | `GUPSHUP_USER_ID` env var |
| auth_scheme | `plain` |
| password | `GUPSHUP_API_KEY` env var |
| v | `1.1` |
| format | `text` |
| dltTemplateId | `1207167325073593251` |
| principalEntityId | `DLT_PRINCIPAL_ENTITY_ID` env var |
| mask | `AspFoH` |

**Response check:** If response text does not include `"success"` → treat as failure.

**OTP format:** 5-digit number (`10000`–`99999`), generated as `Math.floor(10000 + Math.random() * 90000).toString()`

---

## 10. Business Logic Notes

### Student ID Generation
- PostgreSQL sequence `afh_id_seq` (starts at 1, auto-incremented)
- Format: `AFH-` + zero-padded 7 digits
- Thread-safe (uses `nextval()`)
- Example: `AFH-0000001`, `AFH-0000002`, ...

### Attendance Progress Calculation
- `totalHoursAttended` = sum of `classDuration` for all records matching user's `courseId`
- `progressPercentage` = `Math.round(totalHoursAttended / totalClassHours * 100)`
- `totalClassHours` comes from `courses.total_class_hours` (default: 60)
- Dashboard stats use this percentage for "Attendance"

### Attendance % in `getAttendanceStats` (different calculation)
- `total` = count of all records for user (all courses)
- `percentage` = `Math.round(total / 60 * 100)` — denominator hardcoded to 60, NOT from course data

### Location Verification (Offline Sessions)
- Uses Capacitor Geolocation API (`enableHighAccuracy: true`, `timeout: 10000`, `maximumAge: 0`)
- Algorithm: Haversine formula for great-circle distance in meters
- **Allowed radius: 1000 meters** from the QR code's embedded coordinates
- If distance > 1000m → "You are Xm away. Please move closer."
- If permissions denied → "Location permission is required for offline sessions"
- Online sessions skip location verification entirely

### Password Rules
- Minimum 6 characters
- Hashed with bcrypt, 10 salt rounds
- Used for login + forgotten password reset

### Offer Letter Types
- `"uploaded"`: Student uploads own offer letter with full metadata (company, position, job type, location, joining date, salary, joining status, file)
- `"received"`: Offer added externally (e.g., by admin or company integration); has different fields (location as single string, receivedDate, deadlineDate, description)

### Course Enrollment Guard
- On login: If `user.courseId` is null → redirect to `/course-enrollment` instead of `/dashboard`
- On `/dashboard` mount: same check
- On `/course-enrollment` mount: if already enrolled → redirect to `/dashboard` (prevents re-enrollment)

### QR Code Course Validation
- When scanning QR code for attendance, the app checks `qrData.courseId === user.courseId`
- If mismatch → "Wrong Course" error, QR data cleared, user redirected to `/attendance`

---

## 11. QR Code Format for Attendance

The QR code displayed at each session must encode a valid JSON string with this schema:

```json
{
  "sessionId": "unique-session-identifier",
  "session": "Introduction to Digital Marketing",
  "courseId": "the-course-uuid-matching-users-courseId",
  "course": "Digital Marketing Fundamentals",
  "date": "2024-11-10",
  "mode": "offline",
  "classDuration": 2.0,
  "location": {
    "latitude": 18.5204,
    "longitude": 73.8567,
    "address": "Main Hall, Pune Center"
  }
}
```

For online sessions, omit `"location"` (or set to null):
```json
{
  "sessionId": "session-uuid",
  "session": "SEO Basics",
  "courseId": "course-uuid",
  "course": "Digital Marketing Fundamentals",
  "date": "2024-11-10",
  "mode": "online",
  "classDuration": 1.5
}
```

**Validation rules (from `shared/attendance-schema.ts`):**
- `sessionId`: required string
- `session`: required string
- `courseId`: required string
- `course`: required string
- `date`: required string
- `mode`: required, must be `"online"` or `"offline"`
- `classDuration`: optional number (defaults to 2 if missing)
- `location`: optional object with `latitude` (number), `longitude` (number), `address` (string)

The app stores the parsed, validated QR data in `localStorage` key `attendance_qr_data` and passes it through the 3-step attendance flow. It is deleted after successful submission.

---

## 12. Android Build Instructions

**Prerequisites:**
- Node.js, npm, Android Studio with SDK installed
- Java 11+
- Capacitor CLI: `npx cap`

**Standard build and open in Android Studio:**
```bash
npm run build          # Build the Vite app (output: dist/)
npx cap sync android   # Sync web assets to Android project
npx cap open android   # Open Android project in Android Studio
```
Then build and run APK from Android Studio.

**Live reload (development):**
```bash
npx cap run android --livereload --external
```

**Capacitor plugins used:**
- `@capacitor/camera` — selfie capture (front camera, quality 90)
- `@capacitor/geolocation` — location verification for offline attendance
- `@capacitor/android` — Android platform

**Android permissions needed in `AndroidManifest.xml`:**
- `CAMERA` (selfie capture)
- `ACCESS_FINE_LOCATION` (offline attendance location verification)
- `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` (file operations)
- `INTERNET`

---

## 13. Color Palette & Branding

### Brand Colors
| Role | Hex | Usage |
|---|---|---|
| Primary | `#5C4C7D` | Buttons, progress bars, active indicators, badges, icons |
| Primary dark (hover) | `#4C3C6D` | Button hover states |
| Active nav | `#6d10b0` | Active bottom nav tab color |
| Background | `#faf9fb` | Page background |
| Surface | `#f8f9fa` | Logo bar background |
| Card | `#ffffff` | Card backgrounds |
| Light purple | `#eff1ff` | Secondary badge bg, info banners |
| Text dark | `#1d2838` | Headings, primary text |
| Text mid | `#495565` | Secondary text, labels |
| Text light | `#697282` | Captions, timestamps, placeholder-level text |
| Success green | `#00a63e` | Accepted offers, verified badges |
| Warning amber | `#f59e0b` | Pending offers |
| Error red | `#e7000b` | Errors, logout text |
| Star gold | `#fbbf24` | Filled stars |

### Typography
- Font: **Inter** (Google Fonts)
- Fallback: Helvetica

### Logos
- Infosys Foundation (blue): `infosys-foundation-logo-blue.png` — `h-6` in page headers, `h-20` on Landing
- AspireForHer: `afh-logo.png` — `h-8` in page headers, `h-20` on Landing
- Displayed side-by-side with a `×` separator

---

## 14. Known Limitations / Mock Data

The following pages use **hardcoded/mock data** that is NOT driven by the database:

### Certificates Page (`/certificates`)
- Stats (1 Earned, 1 In Progress, 1 Pending) are hardcoded
- Certificate entries (Basic Computer Skills, Digital Marketing Fundamentals, Advanced Excel Training) are hardcoded
- Download generates a static .txt file with a randomly generated certificate ID
- **To make this real:** Add a `certificates` table to the DB, link to `users.id` and `courses.id`, and serve it via a new API endpoint

### Job Opportunities Page (`/job-opportunities`)
- All 3 job listings are hardcoded static objects
- "Apply Now" does NOT call any API — it only updates local React state
- Applied jobs are lost on page reload
- **To make this real:** Add a `job_listings` table and an `applications` table, with proper API endpoints

### Profile Stats (`/profile`)
- "1 Courses Completed", "39 Hours Learned", "2 Certificates", "92% Attendance Rate" are hardcoded
- **To make this real:** Compute from actual attendance records and certificates

### Profile Settings Menu
- "Privacy & Security", "App Settings", "Help & Support" cards have no functionality
- Only "Logout" is wired up

### Dashboard Certificates Stat
- "2 Certificates" on the dashboard progress stats is hardcoded

---

*Document generated from source code of AFH Student App (Replit project). All field names, routes, API shapes, and values reflect the actual implementation.*
