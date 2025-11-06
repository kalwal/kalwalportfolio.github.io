# EcoComply - Environmental Compliance Monitoring Platform

## Overview

EcoComply is a comprehensive environmental compliance monitoring platform designed for citizens, industries, and government administrators. The system enables environmental complaint reporting, compliance tracking, industry management, and regulatory enforcement through a role-based access control system.

**Core Purpose:** Facilitate transparent environmental governance by connecting citizens who report pollution incidents with government officials who enforce regulations and industries that must maintain compliance.

**Key Features:**
- Public complaint submission with geolocation and photo evidence
- Role-based dashboards (Citizen, Industry, Admin)
- Real-time compliance monitoring and reporting
- Industry registration and tracking
- Analytics and data visualization for government oversight

## Project Status

**MVP Complete** - October 16, 2025

The minimum viable product has been successfully implemented and tested. All core features are functional:

✅ **Citizen Module:**
- Complaint submission with category selection (air, water, waste, noise, industrial, other)
- File upload support for evidence (images, PDFs, CSVs up to 5MB)
- Automatic GPS location detection with manual override
- Personal complaint tracking dashboard
- Complaint detail view with full information

✅ **Admin Module:**
- View all complaints across the system (23+ complaints with seed data)
- Update complaint status (submitted → under_review → resolved/rejected)
- Add resolution notes for completed cases
- Analytics dashboard with charts and statistics
- Industry management interface

✅ **Industry Module:**
- Industry registration and profile management
- Compliance report submission
- Document upload for certifications

✅ **Technical Implementation:**
- Replit Auth (OIDC) integration with role-based access
- PostgreSQL database with proper schema and relationships
- File upload with Multer (proper validation and error handling)
- RESTful API with comprehensive error handling
- Responsive UI following Material Design 3 principles
- End-to-end tested with Playwright automation

**Known Minor Issues:**
- Sidebar role label display (cosmetic, doesn't affect functionality)
- Upload storage directory monitoring needed for production scaling

**Next Steps for Production:**
1. Monitor file storage growth and implement cleanup policy
2. Set up regular backup schedules for database
3. Configure production environment variables
4. Add monitoring and logging for production traffic

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript using Vite as the build tool

**Routing:** Wouter for lightweight client-side routing with role-based route protection

**UI Component System:** 
- Shadcn/ui component library (New York variant) for consistent design
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom HSL color system
- Material Design 3 principles adapted for environmental theming

**State Management:**
- TanStack Query (React Query) for server state management and caching
- React Hook Form with Zod validation for form state
- Custom hooks for authentication and shared logic

**Design System:**
- Custom color palette with environmental theming (greens, teals)
- Semantic colors for pollution types (blue for air, orange for waste, etc.)
- Dark mode support with HSL-based theming
- Inter and Roboto font families for accessibility
- WCAG 2.1 AA compliance for government standards

### Backend Architecture

**Runtime:** Node.js with Express.js framework

**API Pattern:** RESTful API with JSON responses

**Middleware Stack:**
- Express JSON/URL-encoded body parsing
- Request/response logging with timing
- Session management with connect-pg-simple
- File upload handling with Multer (5MB limit, images/PDFs/CSVs)

**Authentication & Authorization:**
- OpenID Connect (OIDC) integration via Replit Auth
- Passport.js strategy for authentication flows
- Session-based auth with secure HTTP-only cookies
- Role-based access control (citizen, industry, admin)

**Data Access Layer:**
- Storage abstraction pattern with IStorage interface
- Separation of database operations from route handlers
- Support for complex queries with joins (ComplaintWithUser, IndustryWithOwner)

### Data Storage

**Database:** PostgreSQL via Neon serverless

**ORM:** Drizzle ORM with TypeScript schema definitions

**Schema Design:**
- Users table with role-based permissions (citizen/industry/admin)
- Complaints with geolocation, status tracking, and category tagging
- Industries with owner relationships
- Compliance reports linked to industries
- Inspections for admin oversight
- Sessions table for authentication persistence

**Key Relationships:**
- One-to-many: User → Complaints, User → Industries
- One-to-many: Industry → Compliance Reports, Complaint → Inspections
- Enum types for controlled vocabularies (roles, categories, statuses)

**Migration Strategy:** Drizzle Kit for schema migrations with PostgreSQL dialect

### External Dependencies

**Authentication:**
- Replit OpenID Connect provider for user authentication
- Session management via PostgreSQL-backed session store

**Database:**
- Neon serverless PostgreSQL with WebSocket connections
- Connection pooling via @neondatabase/serverless

**File Storage:**
- Local filesystem storage in `/uploads` directory
- Multer middleware for multipart form handling
- Supported formats: JPEG, PNG, GIF, PDF, CSV

**Development Tools:**
- Vite plugins for Replit integration (cartographer, dev-banner, runtime error overlay)
- TypeScript for type safety across full stack
- Zod for runtime validation with Drizzle schema integration

**Font Loading:**
- Google Fonts API for Inter and Roboto typefaces
- Preconnect optimization for font performance

**UI Libraries:**
- Radix UI component primitives (40+ components)
- Lucide React for consistent iconography
- date-fns for date formatting and manipulation
- class-variance-authority for variant-based component styling