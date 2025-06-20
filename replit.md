# Personal Portfolio Website

## Overview

This is a modern, responsive personal portfolio website built with React, TypeScript, and Express.js. The application showcases projects, technical skills, and provides a contact form for potential clients and employers. It features a clean, professional design with dark/light theme support and smooth animations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Routing**: Wouter for client-side routing
- **State Management**: React Query for server state, React Context for theme management
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM (Database integrated and active)
- **Database Provider**: PostgreSQL 16 module in Replit environment
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot Module Replacement (HMR) via Vite middleware

### Key Design Decisions
1. **Monorepo Structure**: Shared schema and types between client and server
2. **Type Safety**: Full TypeScript coverage with shared validation schemas
3. **Modern Stack**: Leveraging latest React patterns and modern tooling
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Performance**: Optimized with Vite bundling and code splitting

## Key Components

### Frontend Components
- **Navigation**: Fixed header with smooth scroll navigation and mobile menu
- **Hero Section**: Landing area with call-to-action buttons and gradient background
- **Projects**: Filterable project showcase with category-based filtering
- **TechStack**: Grid layout displaying technical skills and tools
- **Contact Form**: Validated form with real-time feedback and toast notifications
- **Theme Provider**: Context-based dark/light theme switching

### Backend Components
- **Express Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with PostgreSQL for data persistence
- **Storage Interface**: Abstracted storage layer with in-memory fallback
- **Contact API**: Form submission endpoint with validation and error handling

### Database Schema
- **Contacts Table**: Stores contact form submissions (name, email, subject, message, timestamp)
- **Users Table**: Basic user authentication structure (username, password)
- **Validation**: Zod schemas for runtime type checking and API validation

## Data Flow

1. **User Interaction**: User interacts with React components
2. **Form Submission**: Contact form data validated with React Hook Form + Zod
3. **API Request**: React Query sends POST request to Express API
4. **Server Processing**: Express validates data and stores in PostgreSQL
5. **Response**: Success/error response sent back to client
6. **UI Update**: Toast notification displays result to user

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router alternative)
- UI Libraries (Radix UI primitives, Tailwind CSS, Lucide icons)
- Form handling (React Hook Form, Zod validators)
- HTTP client (React Query with built-in fetch)
- Utility libraries (clsx, date-fns, class-variance-authority)

### Backend Dependencies
- Express.js with middleware (cors, body parsing, sessions)
- Database (Drizzle ORM, PostgreSQL driver, Neon Database)
- Development tools (tsx for TypeScript execution, esbuild for production)
- Session storage (connect-pg-simple for PostgreSQL sessions)

### Development Dependencies
- Build tools (Vite, esbuild, TypeScript compiler)
- Code quality (ESLint, Prettier configuration through package.json)
- Replit-specific plugins for development environment

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with HMR on port 5000
- **Database**: PostgreSQL 16 module in Replit environment
- **Hot Reloading**: Full-stack hot reloading with Vite middleware

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations applied via `npm run db:push`
- **Deployment**: Replit autoscale deployment with health checks

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Session Secret**: Configured for production security
- **Static Files**: Express serves built React app from `dist/public`

## Changelog

```
Changelog:
- June 20, 2025. Initial setup
- June 20, 2025. Added project detail pages with dynamic routing
- June 20, 2025. Integrated PostgreSQL database, migrated from in-memory storage
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```