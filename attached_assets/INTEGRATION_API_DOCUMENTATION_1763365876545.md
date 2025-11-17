# Integration API Documentation
## Skilling Platform External Integration APIs

**Version:** 1.0.0  
**Last Updated:** January 14, 2025  
**Base URL:** `https://your-platform.replit.app/api/integrations/v1`

---

## Table of Contents
1. [Authentication & Security](#authentication--security)
2. [Incoming APIs (External → Platform)](#incoming-apis)
   - [Sync Beneficiaries](#1-sync-beneficiaries)
   - [Record Attendance](#2-record-attendance)
   - [Upload Offer Letters](#3-upload-offer-letters)
   - [Track Applications](#4-track-applications)
3. [Outgoing APIs (Platform → External)](#outgoing-apis)
   - [Get Placement Opportunities](#1-get-placement-opportunities)
   - [Get Placement Statistics](#2-get-placement-statistics)
4. [Error Handling](#error-handling)
5. [Rate Limits](#rate-limits)
6. [Webhook Events](#webhook-events)
7. [Testing & Examples](#testing--examples)

---

## Authentication & Security

### API Key Authentication

All API requests must include an API key in the request headers.

**Headers Required:**
```
X-API-Key: sk_live_your_secret_key_here
X-Signature: t=1234567890,v1=hmac_sha256_signature
Content-Type: application/json
```

### HMAC Request Signing

To prevent tampering and replay attacks, all requests must be signed using HMAC-SHA256.

**Signature Generation (Sender):**
```javascript
const crypto = require('crypto');

function generateSignature(payload, secretKey) {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  const signedPayload = `${timestamp}.${payloadString}`;
  
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(signedPayload)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

// Usage
const payload = { partnerId: "partner_123", ... };
const signature = generateSignature(payload, 'your_secret_key');

// Add to headers
headers['X-Signature'] = signature;
```

**Signature Verification (Receiver):**
```javascript
function verifySignature(request, secretKey, tolerance = 300) {
  const signature = request.headers['x-signature'];
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
    .createHmac('sha256', secretKey)
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

These APIs are called by the external application to send data to the skilling platform.

### 1. Sync Beneficiaries

Create or update beneficiary (student) records in the platform.

**Endpoint:**
```
POST /api/integrations/v1/beneficiaries
```

**Request Headers:**
```
X-API-Key: sk_live_xxxxx
X-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "partnerId": "partner_123",
  "beneficiaries": [
    {
      "externalId": "ben_ext_456",
      "name": "Rajesh Kumar",
      "email": "rajesh.kumar@example.com",
      "phone": "+91 98765 43210",
      "dateOfBirth": "2000-05-15",
      "gender": "male",
      "educationalQualification": "B.Tech Computer Science",
      "isPWD": false,
      "college": "ABC Engineering College",
      "courseId": "course_789",
      "enrollmentDate": "2025-01-10"
    },
    {
      "externalId": "ben_ext_457",
      "name": "Priya Sharma",
      "email": "priya.sharma@example.com",
      "phone": "+91 98765 43211",
      "dateOfBirth": "2001-08-22",
      "gender": "female",
      "educationalQualification": "B.Tech Electronics",
      "isPWD": false,
      "college": "XYZ Engineering College",
      "courseId": "course_790",
      "enrollmentDate": "2025-01-10"
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `partnerId` | string | Yes | Partner organization ID |
| `beneficiaries` | array | Yes | Array of beneficiary objects (max 100 per request) |
| `externalId` | string | Yes | Unique ID from external system |
| `name` | string | Yes | Full name of beneficiary |
| `email` | string | Yes | Email address |
| `phone` | string | Yes | Phone number with country code |
| `dateOfBirth` | string | Yes | Date in YYYY-MM-DD format |
| `gender` | string | Yes | `male`, `female`, or `other` |
| `educationalQualification` | string | Yes | Highest qualification |
| `isPWD` | boolean | Yes | Person with disability status |
| `college` | string | No | College/institution name |
| `courseId` | string | Yes | Course ID from platform |
| `enrollmentDate` | string | Yes | Enrollment date in YYYY-MM-DD format |

**Success Response (200 OK):**
```json
{
  "status": "success",
  "processed": 2,
  "failed": 0,
  "beneficiaries": [
    {
      "externalId": "ben_ext_456",
      "internalId": "ben_int_111",
      "status": "created",
      "message": "Beneficiary created successfully"
    },
    {
      "externalId": "ben_ext_457",
      "internalId": "ben_int_112",
      "status": "updated",
      "message": "Beneficiary updated successfully"
    }
  ]
}
```

**Partial Success Response (207 Multi-Status):**
```json
{
  "status": "partial_success",
  "processed": 1,
  "failed": 1,
  "beneficiaries": [
    {
      "externalId": "ben_ext_456",
      "internalId": "ben_int_111",
      "status": "created",
      "message": "Beneficiary created successfully"
    },
    {
      "externalId": "ben_ext_457",
      "status": "failed",
      "error": {
        "code": "INVALID_COURSE",
        "message": "Course ID does not exist",
        "field": "courseId"
      }
    }
  ]
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
        "field": "beneficiaries[0].email",
        "message": "Invalid email format"
      }
    ]
  },
  "requestId": "req_abc123"
}
```

---

### 2. Record Attendance

Submit attendance records for beneficiaries. This API is used to track student attendance and automatically update their attendance percentage.

**Endpoint:**
```
POST /api/integrations/v1/attendance
```

**Request Headers:**
```
X-API-Key: sk_live_xxxxx
X-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "partnerId": "partner_123",
  "records": [
    {
      "studentId": "ben_ext_456",
      "name": "Rajesh Kumar",
      "sessionDate": "2025-01-10",
      "status": "present",
      "sessionType": "lecture",
      "courseId": "course_789",
      "hours": 4,
      "topic": "Introduction to Python"
    },
    {
      "studentId": "ben_ext_457",
      "name": "Priya Sharma",
      "sessionDate": "2025-01-10",
      "status": "absent",
      "sessionType": "lecture",
      "courseId": "course_790",
      "hours": 4,
      "topic": "Digital Electronics"
    }
  ]
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `partnerId` | string | Yes | Partner organization ID |
| `records` | array | Yes | Array of attendance records (max 500 per request) |
| `studentId` | string | Yes | Student ID from external system (your student identifier) |
| `name` | string | No | Student's full name (optional, for validation and logging) |
| `sessionDate` | string | Yes | Session date in YYYY-MM-DD format |
| `status` | string | Yes | `present`, `absent`, or `late` |
| `sessionType` | string | Yes | `lecture`, `lab`, `workshop`, or `assessment` |
| `courseId` | string | Yes | Course ID |
| `hours` | number | Yes | Duration in hours (0.5 - 12) |
| `topic` | string | No | Session topic/title |

**Note:** The platform automatically maps your `studentId` to the internal beneficiary record. You only need to use the same student ID that you used when syncing beneficiaries.

**Success Response (200 OK):**
```json
{
  "status": "success",
  "processed": 2,
  "failed": 0,
  "summary": {
    "present": 1,
    "absent": 1,
    "late": 0
  },
  "studentUpdates": [
    {
      "studentId": "ben_ext_456",
      "name": "Rajesh Kumar",
      "attendancePercentage": 85.5,
      "totalSessionsAttended": 34,
      "totalSessions": 40,
      "status": "updated"
    },
    {
      "studentId": "ben_ext_457",
      "name": "Priya Sharma",
      "attendancePercentage": 92.0,
      "totalSessionsAttended": 36,
      "totalSessions": 39,
      "status": "updated"
    }
  ]
}
```

**Partial Success Response (207 Multi-Status):**
```json
{
  "status": "partial_success",
  "processed": 1,
  "failed": 1,
  "summary": {
    "present": 1,
    "absent": 0,
    "late": 0
  },
  "studentUpdates": [
    {
      "studentId": "ben_ext_456",
      "name": "Rajesh Kumar",
      "attendancePercentage": 85.5,
      "status": "updated"
    }
  ],
  "errors": [
    {
      "studentId": "ben_ext_999",
      "error": {
        "code": "STUDENT_NOT_FOUND",
        "message": "Student with ID not found"
      }
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "error": {
    "code": "STUDENT_NOT_FOUND",
    "message": "Student with ID not found",
    "field": "studentId",
    "value": "ben_ext_999"
  },
  "requestId": "req_def456"
}
```

**Attendance Percentage Calculation:**

The attendance percentage is calculated as:
```
Attendance % = (Total Sessions Attended / Total Sessions) × 100
```

Where:
- Sessions marked as `present` or `late` count as attended
- Sessions marked as `absent` do not count as attended
- The calculation is course-specific and cumulative

---

### 3. Upload Offer Letters

Upload offer letter documents for beneficiaries who received placement offers.

**Endpoint:**
```
POST /api/integrations/v1/offer-letters
```

**Request Type:** `multipart/form-data`

**Request Headers:**
```
X-API-Key: sk_live_xxxxx
X-Signature: t=1234567890,v1=abc123...
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
partnerId: partner_123
beneficiaryExternalId: ben_ext_456
placementId: place_999
companyName: Tech Corp India
position: Software Engineer
salary: 600000
joiningDate: 2025-06-01
file: [PDF file binary data]
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `partnerId` | string | Yes | Partner organization ID |
| `beneficiaryExternalId` | string | Yes | Beneficiary's external ID |
| `placementId` | string | Yes | Placement opportunity ID |
| `companyName` | string | Yes | Company name |
| `position` | string | Yes | Job position/title |
| `salary` | number | Yes | Annual salary in INR |
| `joiningDate` | string | Yes | Joining date in YYYY-MM-DD format |
| `file` | file | Yes | PDF file (max 25MB) |

**Success Response (201 Created):**
```json
{
  "status": "success",
  "offerLetter": {
    "id": "offer_123",
    "beneficiaryId": "ben_int_111",
    "placementId": "place_999",
    "driveFileId": "1ABC123xyz",
    "viewUrl": "https://drive.google.com/file/d/1ABC123xyz/view",
    "metadata": {
      "companyName": "Tech Corp India",
      "position": "Software Engineer",
      "salary": 600000,
      "joiningDate": "2025-06-01"
    },
    "uploadedAt": "2025-01-14T10:30:00Z"
  }
}
```

**Error Response (413 Payload Too Large):**
```json
{
  "status": "error",
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum limit of 25MB",
    "maxSize": 26214400
  },
  "requestId": "req_ghi789"
}
```

**Error Response (415 Unsupported Media Type):**
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PDF files are accepted",
    "acceptedTypes": ["application/pdf"]
  },
  "requestId": "req_jkl012"
}
```

---

### 4. Track Applications

Record individual student applications to placement opportunities in real-time.

**Endpoint:**
```
POST /api/integrations/v1/applications
```

**Request Headers:**
```
X-API-Key: sk_live_xxxxx
X-Signature: t=1234567890,v1=abc123...
Content-Type: application/json
```

**Request Body:**
```json
{
  "placementId": "place_999",
  "partnerId": "partner_123",
  "beneficiaryExternalId": "ben_ext_456",
  "appliedAt": "2025-01-14T10:30:00Z"
}
```

**Field Descriptions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `placementId` | string | Yes | Placement opportunity ID |
| `partnerId` | string | Yes | Partner organization ID |
| `beneficiaryExternalId` | string | Yes | Beneficiary's external ID |
| `appliedAt` | string | Yes | Application timestamp (ISO 8601 format) |

**Success Response (201 Created):**
```json
{
  "status": "success",
  "applicationId": "app_555",
  "placementId": "place_999",
  "beneficiaryId": "ben_int_111",
  "currentApplicantCount": 26,
  "message": "Application recorded successfully"
}
```

**Idempotent Response (200 OK - Duplicate):**
```json
{
  "status": "success",
  "applicationId": "app_555",
  "placementId": "place_999",
  "beneficiaryId": "ben_int_111",
  "currentApplicantCount": 25,
  "message": "Application already exists",
  "duplicate": true
}
```

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "error": {
    "code": "PLACEMENT_NOT_FOUND",
    "message": "Placement opportunity does not exist or is no longer active",
    "field": "placementId",
    "value": "place_999"
  },
  "requestId": "req_mno345"
}
```

**Error Response (400 Bad Request - Deadline Passed):**
```json
{
  "status": "error",
  "error": {
    "code": "APPLICATION_DEADLINE_PASSED",
    "message": "Application deadline has passed for this placement",
    "deadline": "2025-01-13T23:59:59Z"
  },
  "requestId": "req_pqr678"
}
```

---

## Outgoing APIs

These APIs are called by the external application to retrieve data from the skilling platform.

### 1. Get Placement Opportunities

Retrieve active placement opportunities available for students.

**Endpoint:**
```
GET /api/integrations/v1/placements
```

**Request Headers:**
```
X-API-Key: pk_live_xxxxx
X-Signature: t=1234567890,v1=abc123...
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `active`, `closed`, `draft` (default: `active`) |
| `partnerId` | string | No | Filter by partner ID |
| `courseId` | string | No | Filter by course ID |
| `page` | number | No | Page number (default: 1) |
| `limit` | number | No | Items per page (default: 50, max: 100) |
| `sortBy` | string | No | Sort field: `createdAt`, `deadline`, `salary` (default: `createdAt`) |
| `sortOrder` | string | No | Sort order: `asc`, `desc` (default: `desc`) |

**Example Request:**
```
GET /api/integrations/v1/placements?status=active&partnerId=partner_123&page=1&limit=50
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "placements": [
    {
      "id": "place_999",
      "companyName": "Tech Corp India",
      "position": "Software Engineer",
      "location": "Bangalore, Karnataka",
      "salary": 600000,
      "openings": 10,
      "eligibilityCriteria": {
        "minQualification": "B.Tech/BE",
        "courses": ["course_789", "course_790"],
        "minAttendance": 75,
        "minPercentage": 60
      },
      "jobDescription": "Full stack development role working with React and Node.js",
      "applicationDeadline": "2025-02-01T23:59:59Z",
      "status": "active",
      "applicantCount": 25,
      "createdAt": "2025-01-10T09:00:00Z",
      "updatedAt": "2025-01-14T10:30:00Z"
    },
    {
      "id": "place_998",
      "companyName": "Data Analytics Inc",
      "position": "Data Analyst",
      "location": "Pune, Maharashtra",
      "salary": 450000,
      "openings": 5,
      "eligibilityCriteria": {
        "minQualification": "B.Tech/BE/BSc",
        "courses": ["course_791"],
        "minAttendance": 70,
        "minPercentage": 55
      },
      "jobDescription": "Analyze business data and create insightful reports",
      "applicationDeadline": "2025-01-25T23:59:59Z",
      "status": "active",
      "applicantCount": 18,
      "createdAt": "2025-01-12T11:00:00Z",
      "updatedAt": "2025-01-14T09:15:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 2,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### 2. Get Placement Statistics

Retrieve detailed statistics for a specific placement opportunity.

**Endpoint:**
```
GET /api/integrations/v1/placements/{placementId}/stats
```

**Request Headers:**
```
X-API-Key: pk_live_xxxxx
X-Signature: t=1234567890,v1=abc123...
```

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `placementId` | string | Yes | Placement opportunity ID |

**Example Request:**
```
GET /api/integrations/v1/placements/place_999/stats
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "placementId": "place_999",
  "companyName": "Tech Corp India",
  "position": "Software Engineer",
  "statistics": {
    "totalApplicants": 25,
    "applicantsByPartner": {
      "partner_123": 15,
      "partner_456": 10
    },
    "applicantsByCourse": {
      "course_789": 20,
      "course_790": 5
    },
    "applicationsByDate": [
      {
        "date": "2025-01-10",
        "count": 5
      },
      {
        "date": "2025-01-11",
        "count": 8
      },
      {
        "date": "2025-01-14",
        "count": 12
      }
    ],
    "genderDistribution": {
      "male": 15,
      "female": 10
    }
  },
  "applicantIds": [
    "app_555",
    "app_556",
    "app_557"
  ]
}
```

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "error": {
    "code": "PLACEMENT_NOT_FOUND",
    "message": "Placement opportunity not found",
    "field": "placementId",
    "value": "place_999"
  },
  "requestId": "req_stu901"
}
```

---

## Error Handling

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "field": "fieldName",
    "value": "invalidValue",
    "details": []
  },
  "requestId": "req_xyz123"
}
```

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `207` | Multi-Status | Partial success (some items failed) |
| `400` | Bad Request | Invalid request payload or parameters |
| `401` | Unauthorized | Missing or invalid API key |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `413` | Payload Too Large | Request body or file too large |
| `415` | Unsupported Media Type | Invalid file type |
| `422` | Unprocessable Entity | Validation failed |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |
| `503` | Service Unavailable | Service temporarily unavailable |

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_API_KEY` | API key is missing or invalid |
| `INVALID_SIGNATURE` | Request signature verification failed |
| `TIMESTAMP_EXPIRED` | Request timestamp is too old (replay attack prevention) |
| `VALIDATION_ERROR` | Request payload validation failed |
| `PARTNER_NOT_FOUND` | Partner ID does not exist |
| `BENEFICIARY_NOT_FOUND` | Beneficiary not found |
| `PLACEMENT_NOT_FOUND` | Placement opportunity not found |
| `COURSE_NOT_FOUND` | Course ID not found |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `FILE_TOO_LARGE` | File exceeds size limit |
| `INVALID_FILE_TYPE` | Unsupported file format |
| `APPLICATION_DEADLINE_PASSED` | Cannot apply after deadline |

### Retry Strategy

For 5xx errors and 429 (rate limit), implement exponential backoff:

```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status >= 500 || error.status === 429) {
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

## Rate Limits

### Default Limits

| API Type | Limit |
|----------|-------|
| Incoming APIs | 100 requests/hour per API key |
| Outgoing APIs | 200 requests/hour per API key |
| Burst Limit | 10 requests/minute |

### Rate Limit Headers

Response headers include rate limit information:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705234800
```

### Rate Limit Exceeded Response

```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after the specified time.",
    "retryAfter": 3600
  },
  "requestId": "req_vwx234"
}
```

---

## Webhook Events

Optional: The platform can send webhook notifications for specific events.

### Webhook Configuration

Contact your administrator to configure webhook URLs for these events:

| Event | Description |
|-------|-------------|
| `placement.created` | New placement opportunity created |
| `placement.updated` | Placement opportunity updated |
| `placement.deadline_approaching` | Application deadline approaching (24 hours) |
| `application.received` | New application received |

### Webhook Payload Example

```json
{
  "eventType": "placement.created",
  "eventId": "evt_abc123",
  "timestamp": "2025-01-14T10:00:00Z",
  "data": {
    "placementId": "place_999",
    "companyName": "Tech Corp India",
    "position": "Software Engineer",
    "openings": 10,
    "deadline": "2025-02-01T23:59:59Z"
  }
}
```

### Webhook Security

Webhooks include the same HMAC signature verification as API requests.

**Verify webhook signature:**
```javascript
function verifyWebhook(request, secretKey) {
  return verifySignature(request, secretKey, 300);
}
```

---

## Testing & Examples

### Complete Example: Node.js

```javascript
const crypto = require('crypto');
const axios = require('axios');

class SkillingPlatformAPI {
  constructor(apiKey, secretKey, baseUrl) {
    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.baseUrl = baseUrl;
  }

  generateSignature(payload) {
    const timestamp = Math.floor(Date.now() / 1000);
    const payloadString = JSON.stringify(payload);
    const signedPayload = `${timestamp}.${payloadString}`;
    
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(signedPayload)
      .digest('hex');
    
    return `t=${timestamp},v1=${signature}`;
  }

  async request(method, endpoint, data = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'X-API-Key': this.apiKey,
      'Content-Type': 'application/json'
    };

    if (data) {
      headers['X-Signature'] = this.generateSignature(data);
    }

    try {
      const response = await axios({
        method,
        url,
        headers,
        data
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Sync beneficiaries
  async syncBeneficiaries(partnerId, beneficiaries) {
    return this.request('POST', '/beneficiaries', {
      partnerId,
      beneficiaries
    });
  }

  // Record attendance
  async recordAttendance(partnerId, records) {
    return this.request('POST', '/attendance', {
      partnerId,
      records
    });
  }

  // Track application
  async trackApplication(placementId, partnerId, beneficiaryExternalId) {
    return this.request('POST', '/applications', {
      placementId,
      partnerId,
      beneficiaryExternalId,
      appliedAt: new Date().toISOString()
    });
  }

  // Get placements
  async getPlacements(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request('GET', `/placements?${queryString}`);
  }

  // Get placement stats
  async getPlacementStats(placementId) {
    return this.request('GET', `/placements/${placementId}/stats`);
  }
}

// Usage Example
const api = new SkillingPlatformAPI(
  'sk_live_your_api_key',
  'your_secret_key',
  'https://your-platform.replit.app/api/integrations/v1'
);

// Example: Sync beneficiaries
async function example() {
  try {
    const result = await api.syncBeneficiaries('partner_123', [
      {
        externalId: 'ben_ext_456',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 9876543210',
        dateOfBirth: '2000-05-15',
        gender: 'male',
        educationalQualification: 'B.Tech Computer Science',
        isPWD: false,
        college: 'ABC College',
        courseId: 'course_789',
        enrollmentDate: '2025-01-10'
      }
    ]);
    
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Testing Checklist

- [ ] API key authentication works
- [ ] HMAC signature verification works
- [ ] Beneficiary sync creates/updates records
- [ ] Attendance recording tracks sessions
- [ ] Offer letter upload stores files
- [ ] Application tracking increments count
- [ ] Placement feed returns active opportunities
- [ ] Placement stats show accurate counts
- [ ] Rate limiting prevents abuse
- [ ] Error responses are properly formatted
- [ ] Idempotency prevents duplicates

---

## Support

For API key generation, technical support, or questions:

- **Email:** support@your-platform.com
- **Documentation:** https://docs.your-platform.com
- **Status Page:** https://status.your-platform.com

---

**Document Version:** 1.0.0  
**Last Updated:** January 14, 2025  
**License:** Proprietary - Confidential
