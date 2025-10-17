# Overview

AFH (AspireForHer) Student is a mobile-first Progressive Web Application (PWA) designed for the Infosys X AspireForHer career transformation program. It aims to empower students with tools for course enrollment, attendance tracking, feedback submission, certificate viewing, and job opportunity exploration. The application supports deployment as both a web app and a native Android application via Capacitor.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with **React 18** and **TypeScript**, using **Vite** for development and building. **Wouter** handles client-side routing, and **TailwindCSS** with **shadcn/ui** provides a utility-first, accessible, and customizable design system. **TanStack Query** manages server state, caching, and data fetching, while React hooks manage local UI state. The design adheres to a mobile-first approach, using a custom purple/violet color palette and the Inter font family.

### Backend Architecture
The backend is an **Express.js** application with **TypeScript** running on **Node.js**. It features modular route registration, centralized error handling, and a custom Vite middleware for development. Storage is currently an **in-memory implementation** (MemStorage) but is designed with an interface-based pattern (IStorage) to easily swap to persistent database solutions like PostgreSQL via Drizzle ORM. Session management uses cookie-based sessions.

### Data Storage Solutions
The project uses **PostgreSQL** for attendance records. Users are currently stored in an in-memory Map-based storage, but the system is prepared for full PostgreSQL integration with **Drizzle ORM** for migrations and schema management. UUID-based primary keys are used, and Zod is employed for schema validation.

### Authentication and Authorization
The system implements a multi-step user registration flow (4 steps) with form validation, including OTP verification for phone numbers. **Bcrypt** is used for password hashing, and a secure, cookie-based session authentication system is in place. User IDs follow an "AFH-XXXXXXX" format, generated thread-safely using PostgreSQL sequences. Login is based on mobile number and password, with a "forgot password" flow involving OTP verification and new password setting.

### Key Application Features
The application includes core routes for:
- User authentication and registration (`/`, `/login`, `/register/*`, `/verify-otp`)
- A central dashboard (`/dashboard`)
- Course management and enrollment (`/course-enrollment`)
- A multi-step attendance system (`/attendance`, `/attendance/mode`, `/attendance/feedback`)
- Attendance history tracking (`/attendance-history`)
- Features for achievements and opportunities (`/certificates`, `/job-offers`, `/job-opportunities`)
- User profile management (`/profile`)
- Comprehensive offer letter management, including upload, tracking, and status updates, with Google Drive integration for document storage.

## External Dependencies

- **UI Component Libraries:** Radix UI (base for shadcn/ui) for accessible React components.
- **Mobile Platform:** Capacitor 7.4.3 for cross-platform Android builds.
- **Styling & Utilities:** TailwindCSS, class-variance-authority, clsx, tailwind-merge.
- **Form Handling:** React Hook Form with Zod for validation.
- **Database (Prepared):** @neondatabase/serverless, Drizzle ORM, drizzle-kit, connect-pg-simple.
- **Build & Development:** esbuild, tsx.
- **Routing:** wouter.