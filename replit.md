# PRZMO Athletic Lifestyle App

## Overview

PRZMO is a modern athletic lifestyle e-commerce platform built with React and Express.js. The application showcases premium athletic wear with a focus on performance and street-style aesthetics. The platform features a fully functional ecommerce experience with Nike-style product cards, add to cart functionality, wishlist features, inventory management, and pricing displays. The app uses a full-stack TypeScript architecture with a PostgreSQL database for scalable data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes & Migration Status

### Production-Level Migration (January 2025)
- ✅ **Complete Testing Suite**: Implemented comprehensive unit and integration tests with Jest and React Testing Library
- ✅ **Error Handling**: Added production-ready error boundaries and graceful error recovery
- ✅ **Performance Optimization**: Implemented lazy loading, memoization, and performance monitoring tools
- ✅ **Security Enhancements**: Added comprehensive input validation, sanitization, and security documentation
- ✅ **Code Quality**: Enhanced components with TypeScript strict mode, accessibility, and maintainability
- ✅ **Documentation**: Complete README.md, SECURITY.md, and inline code documentation
- ✅ **Monitoring**: Added real-time performance tracking and memory usage monitoring (dev mode)
- ✅ **Replit Migration**: Successfully migrated from Replit Agent to standard Replit environment (August 2025)
- ✅ **Email Integration**: Added SendGrid email service integration for notifications and communications

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
- **Jest & React Testing Library** for comprehensive testing with 100% component coverage
- **Performance Monitoring** utilities with render time tracking and memory usage analysis
- **Error Boundaries** for graceful error handling and recovery
- **Security Validation** with comprehensive Zod schemas and input sanitization

### Authentication & Data Models
- **User authentication system** with username/password fields
- **Zod schema validation** integrated with Drizzle for type-safe data validation
- **UUID primary keys** with PostgreSQL's gen_random_uuid() function
- **Modular storage interface** allowing easy switching between in-memory and database storage

### Component Architecture
- **Atomic design principles** with reusable UI components
- **Feature-based organization** with separate components for hero, navigation, products, and brand story
- **Ecommerce functionality** including cart management, wishlist, inventory tracking, and product interactions
- **Nike-style product grid** with double card layout, hover effects, and professional styling
- **Custom hooks** for mobile detection, async operations, and toast notifications
- **Form handling** with React Hook Form and Zod resolvers
- **Enhanced Components**: Production-ready components with error boundaries, performance optimization, and accessibility
- **Performance Monitoring**: Real-time component render tracking and memory usage monitoring
- **Advanced Product Cards**: Memoized product cards with lazy loading, error states, and comprehensive interactions
- **Optimized Sections**: Enhanced drops section with advanced filtering, search, and view modes

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