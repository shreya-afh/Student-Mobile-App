# Overview

AFH (AspireForHer) Student is a mobile-first web application designed for the Infosys X AspireForHer career transformation program. The application provides students with tools to manage course enrollment, track attendance, submit feedback, view certificates, and explore job opportunities. The app is built as a Progressive Web Application (PWA) with Android support through Capacitor, enabling deployment as both a web app and native Android application.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing
- **TailwindCSS** for utility-first styling with custom design tokens
- **shadcn/ui** component library built on Radix UI primitives for accessible, customizable UI components

**State Management:**
- **TanStack Query (React Query)** for server state management, caching, and data fetching
- Local component state with React hooks for UI state

**Design System:**
- Custom color palette centered around purple/violet primary colors (#6d10b0)
- Responsive mobile-first design targeting 768px breakpoint
- Consistent Inter font family throughout the application
- Gradient backgrounds for headers and accent elements

### Backend Architecture

**Server Framework:**
- **Express.js** with TypeScript running on Node.js
- Custom Vite middleware integration for development hot reloading
- Modular route registration pattern through `registerRoutes` function
- Centralized error handling middleware

**Storage Layer:**
- **In-memory storage** implementation (MemStorage) as default
- Interface-based storage pattern (IStorage) allowing easy swapping to database implementations
- Prepared for PostgreSQL integration via Drizzle ORM (configuration present but not actively used)

**Session Management:**
- Cookie-based sessions configured for user authentication
- Session storage interface ready for PostgreSQL via connect-pg-simple

**Development Features:**
- Request/response logging middleware with duration tracking
- Replit-specific development plugins (cartographer, dev banner, runtime error overlay)
- Separate development and production build processes

### Data Storage Solutions

**Current Implementation:**
- PostgreSQL database actively used for attendance records
- In-memory Map-based storage for users
- UUID-based primary keys using crypto.randomUUID()

**Prepared Infrastructure:**
- Drizzle ORM configuration for PostgreSQL migrations
- Schema definitions in `shared/schema.ts` with Zod validation
- Connection string support via DATABASE_URL environment variable
- Migration output configured to `./migrations` directory

**Schema Structure:**
- Users table with id, username, and password fields
- Attendance records table with comprehensive session tracking (userId, sessionId, courseId, mode, location, feedback, rating)
- Extensible schema pattern using Drizzle's table definitions
- Type-safe insert operations via Zod schemas

### Authentication and Authorization

**Planned Implementation:**
- User registration multi-step flow (4 steps) with form validation
- OTP verification for phone number confirmation
- Session-based authentication with secure cookies
- Password-based login system

**Current State:**
- Mock authentication flow routing users through registration/login to dashboard
- Frontend routes protected by navigation flow (not enforced on backend)
- User creation interface defined but not fully implemented

### External Dependencies

**UI Component Libraries:**
- **Radix UI** - Comprehensive collection of accessible, unstyled React components
  - Dialog, Dropdown, Popover, Toast, Accordion, Tabs, and 20+ other primitives
  - Provides accessibility features and keyboard navigation out of the box

**Mobile Platform:**
- **Capacitor 7.4.3** - Cross-platform native runtime
  - Configured for Android builds with package `com.infosys.afh.student`
  - Web assets compiled to `dist/public` and synced to native projects
  - Camera, Storage, and Internet permissions configured

**Styling and Utilities:**
- **TailwindCSS** with PostCSS and Autoprefixer
- **class-variance-authority** for variant-based component styling
- **clsx** and **tailwind-merge** for conditional class composition

**Form Handling:**
- **React Hook Form** with @hookform/resolvers for form state management
- **Zod** for runtime validation and schema definition
- Integration with shadcn/ui form components

**Database (Prepared):**
- **@neondatabase/serverless** - Serverless PostgreSQL driver
- **Drizzle ORM** with drizzle-kit for migrations and schema management
- **connect-pg-simple** for PostgreSQL session storage

**Build and Development:**
- **esbuild** for server-side bundling
- **tsx** for TypeScript execution in development
- Replit-specific plugins for enhanced development experience

**Routing:**
- **wouter** - Minimalist routing library for React (2KB alternative to React Router)

**Key Application Routes:**
- Landing page and authentication (/, /login, /register/step1-4, /verify-otp)
- Dashboard with quick actions (/dashboard)
- Course management (/course-enrollment)
- Attendance system with multi-step flow (/attendance, /attendance/mode, /attendance/feedback)
- Attendance history tracking (/attendance-history)
- Achievements and opportunities (/certificates, /job-offers, /job-opportunities)
- User profile (/profile)

## Recent Changes (October 15, 2025)

### AFH Student ID System & Password Authentication
- **ID Format**: Implemented AFH-XXXXXXX format for all student user IDs (7-digit zero-padded numbers, e.g., AFH-0000001)
- **Thread-Safe Generation**: Uses PostgreSQL sequence (afh_id_seq) for atomic, race-condition-free ID generation
- **Primary Key**: AFH IDs serve as primary keys for all student data across the system
- **Password Security**: 
  - Added password field to registration Step 4 with confirmation validation
  - Bcrypt password hashing (10 salt rounds) implemented in backend
  - Password stored securely in database (never sent in API responses)
  - Minimum 6-character password requirement enforced
- **Post-Registration Flow**: 
  - AFH ID displayed to user after successful registration with alert notification
  - User prompted to note down AFH ID for future login
  - Automatic redirect to dashboard after acknowledgment
- **Implementation**: 
  - Created generateAFHId() utility function using PostgreSQL nextval() for thread-safe ID assignment
  - Updated storage layer to generate AFH IDs before user creation
  - All user references and foreign keys work with AFH-format IDs

### Login & Password Reset System
- **Login Authentication**:
  - Updated login to use AFH Student ID instead of phone number
  - Password-based authentication with bcrypt verification
  - POST /api/login endpoint with AFH ID and password validation
  - Auto-uppercase input for AFH ID field
  - Show/hide password toggle for better UX
- **Forgot Password Flow**:
  - Created 3-step forgot password process:
    1. Enter registered mobile number → Send OTP
    2. Verify OTP (5-digit code)
    3. Set new password with confirmation
  - POST /api/reset-password endpoint for password updates
  - OTP verification reused from registration flow
  - getUserByPhone() and updateUserPassword() storage methods added
  - Password strength validation (min 6 characters)
- **Security Enhancements**:
  - Password never exposed in API responses
  - Bcrypt password comparison for login
  - Secure password hashing before database storage
  - Session-based user authentication maintained

### Attendance Recording and History System
- **Database Integration**: Implemented PostgreSQL storage for attendance records with complete session tracking
- **Attendance Schema**: Created comprehensive schema with userId, sessionId, courseId, sessionName, courseName, sessionDate, mode (online/offline), location data (lat/long/address), rating (1-5), and feedback text
- **API Endpoints**: 
  - POST /api/attendance - Save attendance records to database
  - GET /api/attendance/:userId - Retrieve all attendance records for a user
  - GET /api/attendance/stats/:userId - Get attendance statistics (prepared for future use)
- **Attendance History Page**: New page displaying all attended sessions with:
  - Session name and course name
  - Date and mode (online/offline) indicators
  - Rating display (star icon with numeric rating)
  - Feedback text
  - Proper error handling with retry capability
  - Loading states with user-friendly messages
  - Empty state when no records exist
- **Dashboard Integration**: Made Current Course card clickable to navigate to attendance history
- **Error Handling**: Comprehensive error handling with dedicated error UI and retry functionality
- **Android Compatibility**: All attendance data persisted in PostgreSQL, fully accessible across web and mobile app