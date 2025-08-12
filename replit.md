# PRZMO Athletic Lifestyle App

## Overview

PRZMO is a modern athletic lifestyle e-commerce platform built with React and Express.js. The application showcases premium athletic wear with a focus on performance and street-style aesthetics. The platform features a sleek landing page with product displays, brand storytelling, and newsletter subscription functionality. The app uses a full-stack TypeScript architecture with a PostgreSQL database for scalable data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management and API data fetching
- **Tailwind CSS** with shadcn/ui component library for consistent, modern styling
- **Radix UI** primitives for accessible, unstyled UI components

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **Drizzle ORM** for type-safe database operations and migrations
- **PostgreSQL** as the primary database (configured for Neon Database)
- **In-memory storage interface** for development with easy database migration path
- **Session management** using connect-pg-simple for PostgreSQL session storage

### Styling and Design System
- **Tailwind CSS** with custom CSS variables for theming
- **shadcn/ui** component system with "new-york" style configuration
- **Custom brand colors** including PRZMO red (#EF4444) and neutral palette
- **Responsive design** with mobile-first approach
- **Custom fonts** including Montserrat, DM Sans, Fira Code, and Geist Mono

### Development Tools
- **TypeScript** strict mode for type safety across the entire stack
- **ESBuild** for production bundling of server code
- **PostCSS** with Autoprefixer for CSS processing
- **Drizzle Kit** for database schema management and migrations

### Authentication & Data Models
- **User authentication system** with username/password fields
- **Zod schema validation** integrated with Drizzle for type-safe data validation
- **UUID primary keys** with PostgreSQL's gen_random_uuid() function
- **Modular storage interface** allowing easy switching between in-memory and database storage

### Component Architecture
- **Atomic design principles** with reusable UI components
- **Feature-based organization** with separate components for hero, navigation, products, and brand story
- **Custom hooks** for mobile detection and toast notifications
- **Form handling** with React Hook Form and Zod resolvers

## External Dependencies

### Database & Storage
- **Neon Database** - Serverless PostgreSQL hosting
- **Drizzle ORM** - Type-safe database toolkit
- **connect-pg-simple** - PostgreSQL session store

### UI & Styling
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Pre-built component library
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management

### Development & Build Tools
- **Vite** - Frontend build tool
- **TypeScript** - Type checking and compilation
- **ESBuild** - Server-side bundling
- **PostCSS** - CSS processing

### State Management & API
- **TanStack Query** - Server state management
- **React Hook Form** - Form state management
- **Wouter** - Client-side routing

### Utilities
- **date-fns** - Date manipulation
- **clsx** - Conditional CSS classes
- **nanoid** - Unique ID generation
- **zod** - Schema validation