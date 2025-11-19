# AFH Student Application - Integration API Documentation
## External Partner Integration APIs

**Version:** 1.1.0  
**Last Updated:** January 19, 2025  
**Base URL:** `https://ifafh-skilling.replit.app/api/partners/v1`

---

## Table of Contents
1. [Overview](#overview)
2. [Authentication & Security](#authentication--security)
3. [Incoming APIs (External → AFH Student)](#incoming-apis)
   - [Push Job Opportunities](#1-push-job-opportunities)
4. [Outgoing APIs (AFH Student → External)](#outgoing-apis)
   - [Get Student Attendance Records](#1-get-student-attendance-records)
5. [Application Callback](#application-callback)
6. [Data Mapping & Visibility Rules](#data-mapping--visibility-rules)
7. [Error Handling](#error-handling)
8. [Rate Limits](#rate-limits)
9. [Testing & Examples](#testing--examples)

---

## Overview

### Integration Flow

The AFH Student Application integrates with external managing applications to:

1. **Receive Placement Opportunities** - External applications push job/internship opportunities to AFH Student
2. **Filter by College & Course** - Opportunities are shown only to eligible students based on college name and course code
3. **Track Applications** - When students apply, AFH Student notifies the external application via callback URL
4. **Fetch Attendance Records** - AFH Student retrieves student attendance/session data from external managing application on-demand

### Key Features

- ✅ **College & Course-Based Filtering** - Opportunities visible only to matching students
- ✅ **Secure API Authentication** - HMAC-SHA256 request signing
- ✅ **Idempotent Operations** - Safe to retry requests
- ✅ **Real-time Application Notifications** - Instant callbacks when students apply
- ✅ **Bulk Operations** - Handle multiple opportunities in single request
- ✅ **On-Demand Data Fetching** - Pull attendance records from external system as needed

---

## Authentication & Security

### API Key Authentication

All API requests must include an API key in the request headers.

**Headers Required:**
```
X-AFH-API-Key: afh_partner_live_your_secret_key_here
X-AFH-Signature: t=1234567890,v1=hmac_sha256_signature
Content-Type: application/json
```

### HMAC Request Signing

To prevent tampering and replay attacks, all requests must be signed using HMAC-SHA256.

**Signature Generation (Sender):**
```javascript
const crypto = require('crypto');

function generateAFHSignature(payload, sharedSecret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  
  const signature = crypto
    .createHmac('sha256', sharedSecret)
    .update(signedPayload)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

// Usage Example
const payload = { 
  partnerId: "partner_infosys_001", 
  opportunities: [...] 
};
const sharedSecret = 'your_shared_secret_key';
const signature = generateAFHSignature(payload, sharedSecret);

// Add to headers
headers['X-AFH-API-Key'] = 'afh_partner_live_abc123xyz';
headers['X-AFH-Signature'] = signature;
```

**Signature Verification (Receiver):**
```javascript
function verifyAFHSignature(request, sharedSecret, tolerance = 300) {
  const signature = request.headers['x-afh-signature'];
  if (!signature) throw new Error('Missing signature');
  
  // Parse signature header
  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  const timestamp = parseInt(parts.t);
  const receivedSig = parts.v1;
  
  // Check timestamp (prevent replay attacks)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - timestamp) > tolerance) {
    throw new Error('Request timestamp expired');
  }
  
  // Verify signature
  const payload = request.rawBody; // or JSON.stringify(request.body)
  const expectedSig = crypto
    .createHmac('sha256', sharedSecret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');
  
  if (!crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig))) {
    throw new Error('Invalid signature');
  }
  
  return true;
}
```

### Security Best Practices

- ✅ **Always use HTTPS** - All API calls must use TLS 1.2 or higher
- ✅ **Store API keys securely** - Never commit keys to version control
- ✅ **Rotate keys regularly** - Recommended every 90 days
- ✅ **Validate timestamps** - Reject requests older than 5 minutes
- ✅ **Use idempotency keys** - Prevent duplicate processing
- ✅ **IP whitelisting** - Optional but recommended for production

---

## Incoming APIs

These APIs are called by the external managing application to send data to AFH Student.

### 1. Push Job Opportunities

Create or update job/internship opportunities in AFH Student. Opportunities are filtered and shown only to students matching the specified college and course criteria.

**Endpoint:**
```
POST /api/partners/v1/opportunities
```

**Request Headers:**
```
X-AFH-API-Key: afh_partner_live_xxxxx
X-AFH-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "partnerId": "partner_infosys_001",
  "opportunities": [
    {
      "externalOpportunityId": "opp_ext_12345",
      "title": "Software Developer Internship",
      "description": "6-month internship program for engineering students. Join our team to work on cutting-edge technologies including React, Node.js, and cloud infrastructure.",
      "company": "Tech Solutions India Pvt Ltd",
      "position": "Software Developer Intern",
      "mode": "hybrid",
      "locationType": "urban",
      "locationCity": "Bangalore",
      "locationState": "Karnataka",
      "locationDistrict": "Bangalore Urban",
      "stipend": "15000",
      "jobType": "internship",
      "startDate": "2025-07-01",
      "applicationDeadline": "2025-06-15",
      "callbackUrl": "https://managing-app.com/api/applications/receive",
      "status": "active",
      "visibilityRules": [
        {
          "collegeName": "ABC Engineering College",
          "courseCode": "DM2024B4"
        },
        {
          "collegeName": "XYZ Institute of Technology",
          "courseCode": "DM2024B4"
        }
      ]
    },
    {
      "externalOpportunityId": "opp_ext_12346",
      "title": "Digital Marketing Associate",
      "description": "Full-time position for digital marketing graduates. Focus on SEO, social media marketing, and content strategy.",
      "company": "Digital Dynamics Agency",
      "position": "Digital Marketing Associate",
      "mode": "online",
      "locationType": "remote",
      "locationState": "Remote",
      "stipend": "25000",
      "jobType": "full-time",
      "startDate": "2025-06-01",
      "applicationDeadline": "2025-05-20",
      "callbackUrl": "https://managing-app.com/api/applications/receive",
      "status": "active",
      "visibilityRules": [
        {
          "collegeName": "ABC Engineering College",
          "courseCode": "DM2024B4"
        }
      ]
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `partnerId` | string | Yes | Your partner organization ID (provided by AFH) |
| `opportunities` | array | Yes | Array of opportunity objects (max 50 per request) |
| `externalOpportunityId` | string | Yes | Unique ID from your system (used for idempotency) |
| `title` | string | Yes | Opportunity title (max 200 chars) |
| `description` | string | Yes | Detailed description (max 2000 chars) |
| `company` | string | Yes | Company name |
| `position` | string | Yes | Job position/role title |
| `mode` | string | Yes | `online`, `offline`, or `hybrid` |
| `locationType` | string | No | `rural`, `urban`, `semi-urban`, or `remote` |
| `locationCity` | string | No | City name |
| `locationState` | string | No | State name |
| `locationDistrict` | string | No | District name |
| `stipend` | string | No | Monthly stipend/salary in INR (e.g., "15000") |
| `jobType` | string | No | `full-time`, `part-time`, `internship`, `contract`, `apprenticeship` |
| `startDate` | string | No | Expected start date in YYYY-MM-DD format |
| `applicationDeadline` | string | Yes | Application deadline in YYYY-MM-DD format |
| `callbackUrl` | string | Yes | Your callback endpoint to receive application notifications |
| `status` | string | Yes | `active`, `closed`, or `draft` |
| `visibilityRules` | array | Yes | Array with exactly ONE college-course combination |
| `visibilityRules[].collegeName` | string | Yes | Exact college name (must match AFH records) |
| `visibilityRules[].courseCode` | string | Yes | Course code (e.g., "DM2024B4") |

**Important Notes:**
- **Idempotency:** If you send the same `externalOpportunityId` again, it will UPDATE the existing opportunity instead of creating a duplicate
- **Visibility:** Each opportunity targets exactly ONE college + course combination. To target multiple colleges or courses, create separate opportunities with different `externalOpportunityId` values
- **Case Sensitivity:** College names and course codes are matched case-insensitively
- **Callback URL:** When students apply, AFH Student will POST application details to your `callbackUrl` (see [Application Callback](#application-callback) section)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "processed": 2,
  "failed": 0,
  "results": [
    {
      "externalOpportunityId": "opp_ext_12345",
      "afhOpportunityId": "opp_afh_001",
      "action": "created",
      "message": "Opportunity created successfully",
      "visibleToStudents": 45,
      "matchingColleges": [
        "ABC Engineering College",
        "XYZ Institute of Technology"
      ]
    },
    {
      "externalOpportunityId": "opp_ext_12346",
      "afhOpportunityId": "opp_afh_002",
      "action": "created",
      "message": "Opportunity created successfully",
      "visibleToStudents": 23,
      "matchingColleges": [
        "ABC Engineering College"
      ]
    }
  ],
  "requestId": "req_abc123"
}
```

**Partial Success Response (207 Multi-Status):**
```json
{
  "status": "partial_success",
  "processed": 1,
  "failed": 1,
  "results": [
    {
      "externalOpportunityId": "opp_ext_12345",
      "afhOpportunityId": "opp_afh_001",
      "action": "updated",
      "message": "Opportunity updated successfully",
      "visibleToStudents": 45
    },
    {
      "externalOpportunityId": "opp_ext_12346",
      "action": "failed",
      "error": {
        "code": "INVALID_COURSE_CODE",
        "message": "Course code 'INVALID123' does not exist in AFH system",
        "field": "visibilityRules[0].courseCode",
        "value": "INVALID123"
      }
    }
  ],
  "requestId": "req_def456"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "opportunities[0].applicationDeadline",
        "message": "Application deadline must be a future date",
        "value": "2024-01-01"
      },
      {
        "field": "opportunities[1].visibilityRules",
        "message": "At least one visibility rule is required"
      }
    ]
  },
  "requestId": "req_ghi789"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key"
  },
  "requestId": "req_jkl012"
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Request signature verification failed"
  },
  "requestId": "req_mno345"
}
```

---

## Outgoing APIs

These APIs are called by AFH Student Application to fetch data from the external managing application.

### 1. Get Student Attendance Records

Fetch attendance/session records for a specific student from the external managing application. This API is called on-demand when a student views their attendance history in the AFH Student app.

**Endpoint (External Managing Application):**
```
GET /api/attendance/student/{studentId}
```

**Request Method:** `GET`

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `studentId` | string | Yes | AFH Student ID (format: AFH-0000001) |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `courseId` | string | No | Filter by specific course ID |
| `fromDate` | string | No | Filter sessions from this date (YYYY-MM-DD) |
| `toDate` | string | No | Filter sessions until this date (YYYY-MM-DD) |
| `limit` | integer | No | Maximum number of records to return (default: 100, max: 500) |
| `offset` | integer | No | Pagination offset (default: 0) |

**Request Headers:**
```
X-AFH-API-Key: afh_partner_live_xxxxx
X-AFH-Signature: t=1234567890,v1=abc123...
Accept: application/json
```

**Example Request:**
```bash
GET https://managing-app.replit.app/api/attendance/student/AFH-0000001?courseId=DM2024B4&limit=50
```

**Signature Generation:**

Since this is a GET request with no body, the signature is generated using the request path and query string:

```javascript
const crypto = require('crypto');

function generateSignatureForGET(path, queryParams, secretKey) {
  const timestamp = Math.floor(Date.now() / 1000);
  const queryString = new URLSearchParams(queryParams).toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;
  const signedPayload = `${timestamp}.${fullPath}`;
  
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(signedPayload)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

// Usage Example
const path = '/api/attendance/student/AFH-0000001';
const queryParams = { courseId: 'DM2024B4', limit: 50 };
const signature = generateSignatureForGET(path, queryParams, 'your_shared_secret');

// Add to headers
headers['X-AFH-API-Key'] = 'afh_partner_live_abc123xyz';
headers['X-AFH-Signature'] = signature;
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "studentId": "AFH-0000001",
  "studentName": "Shreya Mishra",
  "courseId": "DM2024B4",
  "courseName": "Digital Marketing Fundamentals",
  "totalRecords": 13,
  "attendanceRecords": [
    {
      "sessionId": "sess_dm_001",
      "sessionName": "Introduction to Digital Marketing",
      "sessionDate": "2025-01-05",
      "classDuration": 2.0,
      "mode": "offline",
      "locationLat": "12.9716",
      "locationLong": "77.5946",
      "locationAddress": "ABC Engineering College, MG Road, Bangalore",
      "rating": 5,
      "feedback": "Excellent session on digital marketing fundamentals",
      "recordedAt": "2025-01-05T14:30:00Z"
    },
    {
      "sessionId": "sess_dm_002",
      "sessionName": "SEO Basics and Best Practices",
      "sessionDate": "2025-01-08",
      "classDuration": 1.5,
      "mode": "online",
      "locationLat": null,
      "locationLong": null,
      "locationAddress": null,
      "rating": 4,
      "feedback": "Good content on SEO strategies",
      "recordedAt": "2025-01-08T15:00:00Z"
    },
    {
      "sessionId": "sess_dm_003",
      "sessionName": "Social Media Marketing",
      "sessionDate": "2025-01-10",
      "classDuration": 2.5,
      "mode": "offline",
      "locationLat": "12.9716",
      "locationLong": "77.5946",
      "locationAddress": "ABC Engineering College, MG Road, Bangalore",
      "rating": 5,
      "feedback": "Very practical session with real-world examples",
      "recordedAt": "2025-01-10T16:45:00Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "summary": {
    "totalSessionsAttended": 13,
    "totalHoursCompleted": 7.5,
    "totalCourseHours": 60,
    "attendancePercentage": 12.5,
    "averageRating": 4.6
  },
  "requestId": "req_attendance_001"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | Yes | Unique session/class identifier |
| `sessionName` | string | Yes | Name/topic of the session |
| `sessionDate` | string | Yes | Session date in YYYY-MM-DD format |
| `classDuration` | number | Yes | Duration in hours (supports decimals like 1.5, 2.5) |
| `mode` | string | Yes | Session mode: `online` or `offline` |
| `locationLat` | string/null | No | Latitude (required for offline mode, null for online) |
| `locationLong` | string/null | No | Longitude (required for offline mode, null for online) |
| `locationAddress` | string/null | No | Full address (required for offline mode, null for online) |
| `rating` | integer | Yes | Student rating for the session (1-5) |
| `feedback` | string/null | No | Student's textual feedback/comments |
| `recordedAt` | string | Yes | ISO 8601 timestamp when attendance was recorded |

**Empty Result Response (200 OK):**
```json
{
  "status": "success",
  "studentId": "AFH-0000001",
  "studentName": "Shreya Mishra",
  "courseId": "DM2024B4",
  "courseName": "Digital Marketing Fundamentals",
  "totalRecords": 0,
  "attendanceRecords": [],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "hasMore": false
  },
  "summary": {
    "totalSessionsAttended": 0,
    "totalHoursCompleted": 0,
    "totalCourseHours": 60,
    "attendancePercentage": 0,
    "averageRating": 0
  },
  "requestId": "req_attendance_002"
}
```

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Student with ID 'AFH-0000001' not found in managing application"
  },
  "requestId": "req_attendance_003"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_API_KEY",
    "message": "Invalid or expired API key"
  },
  "requestId": "req_attendance_004"
}
```

**Error Response (403 Forbidden):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_SIGNATURE",
    "message": "Request signature verification failed"
  },
  "requestId": "req_attendance_005"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Invalid date range: 'fromDate' must be before 'toDate'",
    "details": {
      "fromDate": "2025-12-01",
      "toDate": "2025-01-01"
    }
  },
  "requestId": "req_attendance_006"
}
```

**Important Implementation Notes:**

1. **Data Sync Strategy:**
   - AFH Student no longer stores attendance records locally
   - Data is fetched on-demand when users view their attendance history
   - External application is the single source of truth for attendance data

2. **Performance Considerations:**
   - Response should be returned within 2 seconds for optimal user experience
   - Implement caching on external application side if needed
   - Use pagination for large datasets (>100 records)

3. **Data Mapping:**
   - Student ID format must match AFH format (AFH-XXXXXXX)
   - Session dates should be in YYYY-MM-DD format
   - Class duration must be numeric (supports decimals)
   - Mode must be either "online" or "offline" (lowercase)

4. **Security:**
   - Always verify API key and HMAC signature
   - Validate student ID format before querying database
   - Implement rate limiting to prevent abuse

5. **Backward Compatibility:**
   - If an older version of AFH Student makes a request without required headers, return 401 with clear error message
   - Always include `requestId` in responses for debugging

**Implementation Example (External Application):**

```javascript
// Example Express.js endpoint in external managing application
const express = require('express');
const crypto = require('crypto');

app.get('/api/attendance/student/:studentId', async (req, res) => {
  try {
    // 1. Verify API key
    const apiKey = req.headers['x-afh-api-key'];
    if (!apiKey || !verifyAPIKey(apiKey)) {
      return res.status(401).json({
        status: 'error',
        error: { code: 'INVALID_API_KEY', message: 'Invalid or expired API key' },
        requestId: generateRequestId()
      });
    }

    // 2. Verify HMAC signature
    const signature = req.headers['x-afh-signature'];
    const fullPath = req.originalUrl;
    if (!verifySignatureForGET(signature, fullPath, sharedSecret)) {
      return res.status(403).json({
        status: 'error',
        error: { code: 'INVALID_SIGNATURE', message: 'Request signature verification failed' },
        requestId: generateRequestId()
      });
    }

    // 3. Extract and validate parameters
    const { studentId } = req.params;
    const { courseId, fromDate, toDate, limit = 100, offset = 0 } = req.query;

    if (!studentId.match(/^AFH-\d{7}$/)) {
      return res.status(400).json({
        status: 'error',
        error: { code: 'INVALID_STUDENT_ID', message: 'Invalid student ID format' },
        requestId: generateRequestId()
      });
    }

    // 4. Fetch attendance records from database
    const records = await fetchAttendanceRecords({
      studentId,
      courseId,
      fromDate,
      toDate,
      limit: Math.min(parseInt(limit), 500),
      offset: parseInt(offset)
    });

    // 5. Calculate summary statistics
    const summary = calculateSummary(records);

    // 6. Return response
    res.json({
      status: 'success',
      studentId,
      studentName: records.studentName,
      courseId: records.courseId,
      courseName: records.courseName,
      totalRecords: records.total,
      attendanceRecords: records.data,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: records.hasMore
      },
      summary,
      requestId: generateRequestId()
    });

  } catch (error) {
    console.error('Attendance API error:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      requestId: generateRequestId()
    });
  }
});

function verifySignatureForGET(signature, fullPath, secretKey, tolerance = 300) {
  if (!signature) return false;
  
  const parts = signature.split(',').reduce((acc, part) => {
    const [key, value] = part.split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  const timestamp = parseInt(parts.t);
  const receivedSig = parts.v1;
  
  // Check timestamp
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - timestamp) > tolerance) {
    return false;
  }
  
  // Verify signature
  const signedPayload = `${timestamp}.${fullPath}`;
  const expectedSig = crypto
    .createHmac('sha256', secretKey)
    .update(signedPayload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(receivedSig),
    Buffer.from(expectedSig)
  );
}
```

---

## Application Callback

When a student applies to an opportunity, AFH Student will immediately notify your system by calling your callback endpoint.

### Application Flow

1. Student clicks "Apply" on an opportunity in AFH Student app
2. AFH Student records the application internally
3. AFH Student sends application details to your callback URL
4. Your system processes the application and returns acknowledgment

### Callback Configuration

When pushing opportunities to AFH Student, include a `callbackUrl` field:

```json
{
  "externalOpportunityId": "opp_ext_12345",
  "title": "Software Developer Internship",
  "callbackUrl": "https://your-managing-app.com/api/applications/receive",
  ...
}
```

### Callback Request (AFH Student → Your Application)

AFH Student will make a POST request to your `callbackUrl` with the following payload:

**Request Method:** `POST`

**Request Headers:**
```
X-AFH-API-Key: afh_partner_live_xxxxx
X-AFH-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "externalOpportunityId": "opp_ext_12345",
  "application": {
    "studentId": "AFH-0000001",
    "studentName": "Shreya Mishra",
    "email": "shreya.mishra@example.com",
    "phone": "8887566835",
    "whatsappNumber": "8887566835",
    "college": "ABC Engineering College",
    "courseCode": "DM2024B4",
    "courseName": "Digital Marketing Fundamentals",
    "city": "Bangalore",
    "state": "Karnataka",
    "district": "Bangalore Urban",
    "appliedAt": "2025-01-14T10:30:00Z"
  }
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `externalOpportunityId` | string | Your opportunity ID |
| `studentId` | string | AFH Student ID (format: AFH-0000001) |
| `studentName` | string | Full name of the student |
| `email` | string | Email address |
| `phone` | string | Primary contact number |
| `whatsappNumber` | string | WhatsApp number |
| `college` | string | College/institution name |
| `courseCode` | string | Course code enrolled in |
| `courseName` | string | Full course name |
| `city` | string | City of residence |
| `state` | string | State of residence |
| `district` | string | District of residence |
| `appliedAt` | string | Application timestamp (ISO 8601) |

### Expected Response from Your Application

Your callback endpoint should return one of these responses:

**Success Response (200 OK):**
```json
{
  "status": "success",
  "applicationId": "app_12345",
  "message": "Application received successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_STUDENT",
    "message": "Student does not meet eligibility criteria"
  }
}
```

### Retry Logic

If your callback endpoint fails or times out:
- AFH Student will retry up to **3 times** with exponential backoff (5s, 15s, 45s)
- After 3 failed attempts, the application will be marked as "pending notification"
- You can manually fetch pending applications via a separate sync endpoint (to be provided)

### Security

The callback request will be signed using the same HMAC-SHA256 signature mechanism. Verify the signature to ensure the request is authentic and from AFH Student.

---

## Data Mapping & Visibility Rules

### College & Course Matching

**Critical:** Opportunity visibility is determined by exact matching of college name and course code.

**AFH Student Database Structure:**

| AFH Field | Type | Example | Your Field |
|-----------|------|---------|------------|
| `users.collegeName` | string | "ABC Engineering College" | `visibilityRules[].collegeName` |
| `courses.courseCode` | string | "DM2024B4" | `visibilityRules[].courseCode` |
| `courses.courseName` | string | "Digital Marketing Fundamentals" | (informational only) |

**Matching Logic:**
1. **Case-Insensitive:** "ABC Engineering College" matches "abc engineering college"
2. **Exact Match:** Partial matches are not supported
3. **AND Condition:** BOTH college AND course must match exactly
4. **Single Rule Only:** Each opportunity must have exactly ONE visibility rule

**Valid Example:**
```json
{
  "externalOpportunityId": "opp_001",
  "title": "Software Developer Internship",
  "visibilityRules": [
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "DM2024B4"
    }
  ]
}
```
✅ **Visible to:** Students from "ABC Engineering College" enrolled in "DM2024B4" ONLY  
❌ **Not visible to:** Students from other colleges OR other courses

**Invalid Examples (Multiple Rules):**
```json
// ❌ INVALID: Multiple colleges
{
  "visibilityRules": [
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "DM2024B4"
    },
    {
      "collegeName": "XYZ Institute of Technology",
      "courseCode": "DM2024B4"
    }
  ]
}

// ❌ INVALID: Multiple courses
{
  "visibilityRules": [
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "DM2024B4"
    },
    {
      "collegeName": "ABC Engineering College",
      "courseCode": "FS2024A1"
    }
  ]
}
```

**How to Target Multiple Colleges or Courses:**

If you want to target multiple colleges or courses, create **separate opportunities**:

```json
{
  "partnerId": "partner_infosys_001",
  "opportunities": [
    {
      "externalOpportunityId": "opp_001_college_abc",
      "title": "Software Developer Internship",
      "visibilityRules": [
        {
          "collegeName": "ABC Engineering College",
          "courseCode": "DM2024B4"
        }
      ]
    },
    {
      "externalOpportunityId": "opp_001_college_xyz",
      "title": "Software Developer Internship",
      "visibilityRules": [
        {
          "collegeName": "XYZ Institute of Technology",
          "courseCode": "DM2024B4"
        }
      ]
    }
  ]
}
```

### Student ID Format

**AFH Student IDs:**
- Format: `AFH-XXXXXXX` (e.g., `AFH-0000001`, `AFH-0000013`)
- Sequential numbering starting from AFH-0000001
- Always use this ID when tracking applicants in your system

### Apply URL Integration

When students click "Apply" on an opportunity, they are redirected to your `applyUrl` with query parameters:

**Redirect Format:**
```
{applyUrl}?studentId={afhStudentId}&opportunityId={externalOpportunityId}
```

**Example:**
```
https://managing-app.com/apply/opp_ext_12345?studentId=AFH-0000001&opportunityId=opp_ext_12345
```

**Your Application Should:**
1. Extract `studentId` and `opportunityId` from query params
2. Record the application in your system
3. Optionally call AFH Student webhook (if provided) to update application status

---

## Error Handling

### Standard Error Response Format

All errors follow this structure:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "field": "fieldName (if applicable)",
    "value": "invalid value (if applicable)"
  },
  "requestId": "req_unique_id"
}
```

### Error Codes

| HTTP Status | Error Code | Description | Resolution |
|-------------|------------|-------------|------------|
| **400** | `VALIDATION_ERROR` | Request payload validation failed | Check field requirements in error.details |
| **400** | `INVALID_COURSE_CODE` | Course code doesn't exist in AFH | Use valid course codes from AFH catalog |
| **400** | `INVALID_COLLEGE_NAME` | College name doesn't match any AFH records | Verify exact college name spelling |
| **400** | `INVALID_STUDENT_ID` | Student ID format is invalid | Use AFH-XXXXXXX format |
| **400** | `INVALID_DATE_RANGE` | Date range validation failed | Ensure fromDate < toDate |
| **400** | `PAST_DEADLINE` | Application deadline is in the past | Use future date for deadline |
| **400** | `MISSING_VISIBILITY_RULES` | No visibility rules provided | Add at least one visibility rule |
| **401** | `INVALID_API_KEY` | API key is invalid or expired | Check API key or request new one |
| **401** | `MISSING_API_KEY` | API key not provided in headers | Add X-AFH-API-Key header |
| **403** | `INVALID_SIGNATURE` | HMAC signature verification failed | Check signature generation logic |
| **403** | `TIMESTAMP_EXPIRED` | Request timestamp too old (>5 min) | Ensure clock synchronization |
| **403** | `UNAUTHORIZED_PARTNER` | Partner ID mismatch | Verify partnerId matches API key |
| **404** | `OPPORTUNITY_NOT_FOUND` | Opportunity doesn't exist | Check externalOpportunityId |
| **404** | `STUDENT_NOT_FOUND` | Student doesn't exist in managing app | Verify student ID is synced |
| **409** | `DUPLICATE_APPLICATION` | Student already applied | This is informational, not an error |
| **413** | `PAYLOAD_TOO_LARGE` | Request exceeds size limit | Reduce opportunities per request (<50) |
| **429** | `RATE_LIMIT_EXCEEDED` | Too many requests | Implement exponential backoff |
| **500** | `INTERNAL_ERROR` | Server error | Retry with exponential backoff |
| **503** | `SERVICE_UNAVAILABLE` | Temporary service disruption | Retry after specified seconds |

### Error Handling Best Practices

**1. Implement Retry Logic:**
```javascript
async function postOpportunityWithRetry(opportunity, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(opportunity)
      });
      
      if (response.ok) return await response.json();
      
      const error = await response.json();
      
      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(error.error.message);
      }
      
      // Retry server errors (5xx)
      if (i < maxRetries - 1) {
        await sleep(Math.pow(2, i) * 1000); // Exponential backoff
      }
    } catch (err) {
      if (i === maxRetries - 1) throw err;
    }
  }
}
```

**2. Handle Partial Success:**
```javascript
const response = await postOpportunities(opportunities);

if (response.status === 'partial_success') {
  // Log successful ones
  response.results
    .filter(r => r.action !== 'failed')
    .forEach(r => console.log(`✓ ${r.externalOpportunityId}`));
  
  // Handle failures
  response.results
    .filter(r => r.action === 'failed')
    .forEach(r => {
      console.error(`✗ ${r.externalOpportunityId}: ${r.error.message}`);
      // Optionally queue for manual review
    });
}
```

---

## Rate Limits

### Request Limits

**Incoming APIs (External → AFH Student):**

| Endpoint | Rate Limit | Burst Limit |
|----------|------------|-------------|
| `POST /opportunities` | 60 requests/minute | 10 requests/second |

**Outgoing APIs (AFH Student → External):**

| Endpoint | Rate Limit | Burst Limit |
|----------|------------|-------------|
| `GET /attendance/student/{studentId}` | 120 requests/minute | 20 requests/second |

**Note:** 
- Callbacks from AFH Student to your application are not subject to these rate limits
- External managing application should implement its own rate limiting for the attendance endpoint

### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705234800
```

### Rate Limit Exceeded Response (429)

```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 30 seconds.",
    "retryAfter": 30
  },
  "requestId": "req_rate_001"
}
```

### Best Practices

1. **Respect Rate Limits:** Monitor `X-RateLimit-Remaining` header
2. **Implement Backoff:** Wait for `retryAfter` seconds before retrying
3. **Batch Operations:** Use bulk endpoints (max 50 opportunities per request)
4. **Callback Reliability:** Ensure your callback endpoint is highly available and responds quickly (<3s)

---

## Testing & Examples

### Getting Started

**1. Obtain API Credentials**

Contact AFH Student support to receive:
```json
{
  "partnerId": "partner_your_org_001",
  "apiKey": "afh_partner_live_abc123xyz789",
  "sharedSecret": "secret_xyz789abc123",
  "sandboxUrl": "https://sandbox-afh-student.replit.app/api/partners/v1"
}
```

**2. Test Environment**

Use the sandbox URL for testing:
```
Sandbox Base URL: https://sandbox-afh-student.replit.app/api/partners/v1
Production Base URL: https://ifafh-skilling.replit.app/api/partners/v1
```

### Example 1: Post Single Opportunity

**cURL Example:**
```bash
curl -X POST "https://ifafh-skilling.replit.app/api/partners/v1/opportunities" \
  -H "X-AFH-API-Key: afh_partner_live_abc123xyz789" \
  -H "X-AFH-Signature: t=1705234800,v1=abcdef123456..." \
  -H "Content-Type: application/json" \
  -d '{
    "partnerId": "partner_infosys_001",
    "opportunities": [
      {
        "externalOpportunityId": "opp_test_001",
        "title": "Test Internship",
        "description": "This is a test opportunity",
        "company": "Test Company",
        "position": "Test Position",
        "mode": "hybrid",
        "stipend": "10000",
        "jobType": "internship",
        "applicationDeadline": "2025-12-31",
        "callbackUrl": "https://example.com/api/applications/receive",
        "status": "active",
        "visibilityRules": [
          {
            "collegeName": "ABC Engineering College",
            "courseCode": "DM2024B4"
          }
        ]
      }
    ]
  }'
```

**JavaScript/Node.js Example:**
```javascript
const crypto = require('crypto');

const partnerId = 'partner_infosys_001';
const apiKey = 'afh_partner_live_abc123xyz789';
const sharedSecret = 'secret_xyz789abc123';

const payload = {
  partnerId: partnerId,
  opportunities: [
    {
      externalOpportunityId: 'opp_test_001',
      title: 'Software Developer Internship',
      description: '6-month internship for engineering students',
      company: 'Tech Solutions India',
      position: 'Software Developer Intern',
      mode: 'hybrid',
      locationCity: 'Bangalore',
      locationState: 'Karnataka',
      stipend: '15000',
      jobType: 'internship',
      applicationDeadline: '2025-12-31',
      callbackUrl: 'https://example.com/api/applications/receive',
      status: 'active',
      visibilityRules: [
        {
          collegeName: 'ABC Engineering College',
          courseCode: 'DM2024B4'
        }
      ]
    }
  ]
};

// Generate signature
function generateSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

const signature = generateSignature(payload, sharedSecret);

// Make API request
const response = await fetch(
  'https://ifafh-skilling.replit.app/api/partners/v1/opportunities',
  {
    method: 'POST',
    headers: {
      'X-AFH-API-Key': apiKey,
      'X-AFH-Signature': signature,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }
);

const result = await response.json();
console.log(result);
```

**Python Example:**
```python
import hashlib
import hmac
import json
import time
import requests

partner_id = 'partner_infosys_001'
api_key = 'afh_partner_live_abc123xyz789'
shared_secret = 'secret_xyz789abc123'

payload = {
    'partnerId': partner_id,
    'opportunities': [
        {
            'externalOpportunityId': 'opp_test_001',
            'title': 'Software Developer Internship',
            'description': '6-month internship for engineering students',
            'company': 'Tech Solutions India',
            'position': 'Software Developer Intern',
            'mode': 'hybrid',
            'locationCity': 'Bangalore',
            'stipend': '15000',
            'jobType': 'internship',
            'applicationDeadline': '2025-12-31',
            'callbackUrl': 'https://example.com/api/applications/receive',
            'status': 'active',
            'visibilityRules': [
                {
                    'collegeName': 'ABC Engineering College',
                    'courseCode': 'DM2024B4'
                }
            ]
        }
    ]
}

# Generate signature
def generate_signature(payload, secret):
    timestamp = int(time.time())
    payload_string = json.dumps(payload)
    signed_payload = f"{timestamp}.{payload_string}"
    signature = hmac.new(
        secret.encode('utf-8'),
        signed_payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return f"t={timestamp},v1={signature}"

signature = generate_signature(payload, shared_secret)

# Make API request
response = requests.post(
    'https://ifafh-skilling.replit.app/api/partners/v1/opportunities',
    headers={
        'X-AFH-API-Key': api_key,
        'X-AFH-Signature': signature,
        'Content-Type': 'application/json'
    },
    json=payload
)

print(response.json())
```

### Example 2: Implement Callback Endpoint (Your Side)

Your application needs to implement a callback endpoint to receive application notifications from AFH Student.

**Express.js/Node.js Example:**
```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Your callback endpoint
app.post('/api/applications/receive', (req, res) => {
  try {
    // Verify signature
    const signature = req.headers['x-afh-signature'];
    const apiKey = req.headers['x-afh-api-key'];
    
    // Verify API key matches
    if (apiKey !== 'afh_partner_live_abc123xyz789') {
      return res.status(401).json({
        status: 'error',
        error: { code: 'INVALID_API_KEY', message: 'Invalid API key' }
      });
    }
    
    // Verify signature (same logic as receiving requests)
    // ... signature verification code ...
    
    // Process application
    const { externalOpportunityId, application } = req.body;
    
    console.log(`New application received for opportunity: ${externalOpportunityId}`);
    console.log(`Student: ${application.studentName} (${application.studentId})`);
    console.log(`Email: ${application.email}, Phone: ${application.phone}`);
    
    // Save to your database
    // ... your database logic ...
    
    // Return success
    res.json({
      status: 'success',
      applicationId: 'app_' + Date.now(),
      message: 'Application received successfully'
    });
    
  } catch (error) {
    console.error('Callback error:', error);
    res.status(500).json({
      status: 'error',
      error: { code: 'INTERNAL_ERROR', message: error.message }
    });
  }
});

app.listen(3000, () => console.log('Callback server running on port 3000'));
```

### Testing Checklist

Before going to production, verify:

**Incoming APIs (Job Opportunities):**
- [ ] Successfully authenticate with API key and signature
- [ ] Post test opportunity with valid visibility rules and callback URL
- [ ] Verify opportunity appears to matching students only
- [ ] Test opportunity update (same externalOpportunityId)
- [ ] Implement and test callback endpoint to receive applications
- [ ] Verify callback signature validation works
- [ ] Test callback retry logic (simulate endpoint failures)

**Outgoing APIs (Attendance Records):**
- [ ] Implement attendance endpoint with proper authentication
- [ ] Test successful attendance data fetch with valid student ID
- [ ] Verify signature validation for GET requests
- [ ] Test with invalid student ID format
- [ ] Test with student not found in system
- [ ] Verify pagination works correctly
- [ ] Test date range filtering (fromDate, toDate)
- [ ] Ensure response time is under 2 seconds
- [ ] Verify summary calculations are accurate

**General:**
- [ ] Handle rate limits gracefully
- [ ] Implement retry logic for 5xx errors
- [ ] Validate all error responses (400, 401, 403, 404)
- [ ] Test with expired timestamp (signature validation)
- [ ] Verify HTTPS/TLS connection

---

## Support & Contact

For API integration support, credentials, or technical assistance:

- **Email:** api-support@afhstudent.org
- **Slack Channel:** #afh-partner-integration
- **Documentation:** https://docs.afhstudent.org/integrations
- **Status Page:** https://status.afhstudent.org

---

## Changelog

### Version 1.1.0 (January 19, 2025)
- **[NEW]** Added Outgoing API: Get Student Attendance Records
- **[BREAKING]** AFH Student no longer stores attendance records locally
- **[CHANGE]** Attendance data now fetched on-demand from external managing application
- Updated error codes to include attendance-related errors
- Added rate limits for attendance API endpoint
- Added signature generation example for GET requests
- Updated testing checklist with attendance API tests

### Version 1.0.0 (January 17, 2025)
- Initial API release
- Added opportunity push endpoint
- Implemented callback mechanism for application notifications
- Implemented HMAC-SHA256 authentication
- Added college & course visibility filtering
- Support for retry logic on callback failures

---

**© 2025 AFH Student Application. All rights reserved.**
