# Technical Documentation: Project Structure Analysis

## Executive Summary

This project is a **Next.js 15** application built with **TypeScript**, following the **App Router** architecture pattern. It implements a **hybrid architecture** combining:
- **Feature-based routing** (App Router file-based routing)
- **Layered architecture** (separation of concerns: models, services, components, API routes)
- **Service-oriented design** (business logic in lib/services)
- **Component-based UI** (React components with feature grouping)

The application serves as an **Election Management and Visualization Platform** for Bangladesh, providing comprehensive election data, candidate information, polling features, and administrative capabilities.

---

## 1. `app/` Directory

### Purpose
The `app/` directory is the **core routing and page structure** of the Next.js application, following the **App Router** pattern introduced in Next.js 13+. This directory defines all routes, API endpoints, layouts, and page components.

### What Files Are Expected Inside

#### **Page Routes** (`page.tsx`)
- **Location**: `app/[route]/page.tsx`
- **Purpose**: Defines the UI component for each route
- **Examples**:
  - `app/page.tsx` - Home page
  - `app/candidates/page.tsx` - Candidates listing page
  - `app/admin/page.tsx` - Admin dashboard
  - `app/blog/page.tsx` - Blog listing page
  - `app/polls/[slug]/page.tsx` - Dynamic poll detail page

#### **API Routes** (`route.ts`)
- **Location**: `app/api/[endpoint]/route.ts`
- **Purpose**: Server-side API endpoints (RESTful)
- **HTTP Methods**: Exports `GET`, `POST`, `PUT`, `DELETE`, `PATCH` functions
- **Examples**:
  - `app/api/candidates/route.ts` - CRUD operations for candidates
  - `app/api/admin/auth/login/route.ts` - Authentication endpoints
  - `app/api/poll/vote/route.ts` - Poll voting logic

#### **Layout Files** (`layout.tsx`)
- **Location**: `app/layout.tsx` (root), `app/[route]/layout.tsx` (nested)
- **Purpose**: Shared UI structure, metadata, fonts, global providers
- **Features**: Wraps pages, defines HTML structure, includes global styles

#### **Loading States** (`loading.tsx`)
- **Location**: `app/[route]/loading.tsx`
- **Purpose**: React Suspense fallback UI during data fetching
- **Example**: `app/polls/[slug]/loading.tsx`

#### **Error Boundaries** (`error.tsx`)
- **Location**: `app/[route]/error.tsx`
- **Purpose**: Error handling UI for route segments

#### **Not Found Pages** (`not-found.tsx`)
- **Location**: `app/[route]/not-found.tsx`
- **Purpose**: Custom 404 pages for specific routes

### Why It Is Separated Like This

1. **File-Based Routing**: Next.js App Router uses the file system as the routing mechanism. Each folder represents a route segment, and `page.tsx` makes it a navigable route.

2. **Colocation**: Related files (page, layout, loading, error) are co-located in the same directory, improving maintainability.

3. **Route Groups**: The `api/` subdirectory groups all API endpoints, while feature routes (admin, blog, polls) are top-level for clear URL structure.

4. **Dynamic Routes**: Square brackets `[id]`, `[slug]` enable dynamic routing without additional configuration.

### How It Interacts with Other Folders

- **Imports from `models/`**: API routes import Mongoose models to interact with the database
  ```typescript
  import InfoCandidate from '@/models/InfoCandidate';
  ```

- **Imports from `lib/`**: Uses utility functions and services
  ```typescript
  import connectDB from '@/lib/mongodb';
  import { blogService } from '@/lib/blogService';
  ```

- **Imports from `components/`**: Page components render UI components
  ```typescript
  import CandidateList from '@/components/CandidateList';
  ```

- **Imports from `types/`**: Uses TypeScript type definitions
  ```typescript
  import { PollDTO } from '@/types/poll';
  ```

### Architecture Pattern

**Next.js App Router Pattern** with:
- **Server Components by Default**: Pages are server-rendered unless marked with `'use client'`
- **API Routes**: RESTful endpoints using Route Handlers
- **Nested Layouts**: Hierarchical layout structure
- **Streaming & Suspense**: Progressive page rendering
- **Route Handlers**: Replaces traditional API routes with file-based handlers

---

## 2. `components/` Directory

### Purpose
The `components/` directory contains **reusable React UI components** that compose the user interface. Components are organized by feature/domain and follow React best practices.

### What Files Are Expected Inside

#### **Feature-Based Subdirectories**
- **`admin/`**: Admin-specific components
  - `BlogManager.tsx` - Blog post management interface
  - `CandidateForm.tsx` - Candidate creation/editing form
  - `RichTextEditor.tsx` - WYSIWYG editor component

- **`blog/`**: Blog-related components
  - `PostCard.tsx` - Blog post preview card
  - `Sidebar.tsx` - Blog sidebar navigation

- **`poll/`**: Polling system components
  - `PollClient.tsx` - Client-side poll interaction
  - `PollQuestionCard.tsx` - Individual poll question display

#### **Standalone Components**
- **Domain Components**: Feature-specific but not grouped
  - `CandidateList.tsx` - Candidate listing with filters
  - `CandidateProfile.tsx` - Candidate detail view
  - `ElectionDetails.tsx` - Election information display
  - `ParliamentVisualization.tsx` - Parliament seating chart
  - `ConstituencyMap.tsx` - Interactive constituency map

- **Shared/Common Components**: Reusable across features
  - `Header.tsx` - Site header/navigation
  - `Navigation.tsx` - Main navigation menu
  - `ContactForm.tsx` - Contact form component
  - `URLPreview.tsx` - Link preview component

- **Utility Components**: Specialized functionality
  - `BlunderAnalysis.tsx` - Data analysis visualization
  - `Timeline.tsx` - Timeline component
  - `DatabaseManager.tsx` - Database management UI

### Why It Is Separated Like This

1. **Feature Grouping**: Related components are grouped in subdirectories (admin, blog, poll) for better organization and discoverability.

2. **Reusability**: Standalone components can be imported across multiple pages without tight coupling.

3. **Separation of Concerns**: UI logic is separated from business logic (which lives in `lib/`), API logic (which lives in `app/api/`), and data models (which live in `models/`).

4. **Component Hierarchy**: Supports both atomic design principles (small, reusable components) and composite components (larger, feature-specific components).

5. **Client vs Server Components**: Components marked with `'use client'` handle interactivity, while server components handle data fetching.

### How It Interacts with Other Folders

- **Consumes API Routes**: Components fetch data from `app/api/` endpoints
  ```typescript
  const response = await fetch('/api/candidates');
  ```

- **Uses Custom Hooks**: Imports hooks from `hooks/` for shared logic
  ```typescript
  import { useFingerprint } from '@/hooks/useFingerprint';
  ```

- **Type Safety**: Uses types from `types/` for props and data structures
  ```typescript
  import { PollDTO } from '@/types/poll';
  ```

- **Service Layer**: May use services from `lib/` for complex operations
  ```typescript
  import { blogService } from '@/lib/blogService';
  ```

- **Static Data**: May import static data from `data/` for maps, constants, etc.
  ```typescript
  import { bangladeshMapData } from '@/data/bangladeshMapData';
  ```

### Architecture Pattern

**Component-Based Architecture** with elements of:
- **Atomic Design**: Small, reusable components (buttons, cards) compose larger components
- **Feature-Based Organization**: Components grouped by domain/feature
- **Container/Presentational Pattern**: Some components handle logic, others are pure presentational
- **Client/Server Component Split**: Interactive components are client-side, static/data-fetching are server-side

---

## 3. `data/` Directory

### Purpose
The `data/` directory contains **static data files**, **configuration data**, and **reference data** that doesn't change frequently or is too large/complex to hardcode in components.

### What Files Are Expected Inside

#### **Static Data Files**
- **Map Data**: Geographic/visualization data
  - `bangladeshMapData.ts` - GeoJSON or coordinate data for Bangladesh map visualizations
  - Used by components like `ConstituencyMap.tsx`, `InteractiveMap.tsx`

#### **Configuration Data**
- **Constants**: Application-wide constants
  - Election years, party names, constituency lists
  - Default values, configuration objects

#### **Seed/Reference Data**
- **Initial Data**: Data structures for seeding databases
- **Lookup Tables**: Reference data for dropdowns, filters

### Why It Is Separated Like This

1. **Separation of Data from Logic**: Static data is separated from business logic and components, making it easier to update without touching code.

2. **Performance**: Large datasets can be imported only when needed, reducing initial bundle size.

3. **Maintainability**: Centralized data makes it easier to update, version, and validate.

4. **Type Safety**: TypeScript files allow type checking and autocomplete for data structures.

5. **Reusability**: Multiple components can import the same data without duplication.

### How It Interacts with Other Folders

- **Imported by Components**: Map and visualization components import geographic data
  ```typescript
  import { bangladeshMapData } from '@/data/bangladeshMapData';
  ```

- **Used by Scripts**: Seed scripts may import reference data for database initialization
  ```typescript
  import { constituencyData } from '@/data/constituencyData';
  ```

- **Referenced by Services**: Business logic services may use constants or lookup data
  ```typescript
  import { ELECTION_YEARS } from '@/data/constants';
  ```

### Architecture Pattern

**Data Layer Pattern**:
- **Static Data Repository**: Centralized storage for non-dynamic data
- **Configuration as Code**: Configuration stored as TypeScript/JSON files
- **Separation of Concerns**: Data separated from presentation and business logic

---

## 4. `hooks/` Directory

### Purpose
The `hooks/` directory contains **custom React hooks** that encapsulate reusable stateful logic, side effects, and data fetching patterns. These hooks follow React's Hooks API and promote code reuse across components.

### What Files Are Expected Inside

#### **Custom Hooks**
- **`useFingerprint.ts`**: Browser fingerprinting for user identification
  - Uses FingerprintJS library
  - Returns visitor ID for tracking/analytics
  - Used for poll voting, fraud prevention

- **`useBlunderAnalysis.ts`**: Data analysis and visualization logic
  - Fetches and processes blunder/error analysis data
  - Handles loading states and error handling
  - Used by `BlunderAnalysis.tsx` component

- **`useLanguagePreference.ts`**: Internationalization (i18n) logic
  - Manages language preference (Bengali/English)
  - Persists preference in localStorage
  - Provides language switching functionality

### Why It Is Separated Like This

1. **Reusability**: Hooks encapsulate logic that can be shared across multiple components, reducing code duplication.

2. **Separation of Concerns**: Business logic and side effects are extracted from components, making components more focused on rendering.

3. **Testability**: Hooks can be tested independently from components.

4. **React Best Practices**: Follows React's recommended pattern for sharing stateful logic.

5. **Composability**: Hooks can be composed together to build complex behaviors.

### How It Interacts with Other Folders

- **Used by Components**: Components import and use hooks for shared logic
  ```typescript
  import { useFingerprint } from '@/hooks/useFingerprint';
  const fingerprint = useFingerprint();
  ```

- **Calls API Routes**: Hooks may fetch data from `app/api/` endpoints
  ```typescript
  const data = await fetch('/api/blunder');
  ```

- **Uses Services**: May call service functions from `lib/` for complex operations
  ```typescript
  import { getBlunderData } from '@/lib/getBlunderData';
  ```

- **Type Safety**: Uses types from `types/` for return values and parameters
  ```typescript
  import { PollDTO } from '@/types/poll';
  ```

### Architecture Pattern

**Custom Hooks Pattern**:
- **Logic Extraction**: Business logic extracted from components into reusable hooks
- **Composition**: Hooks can be composed to build complex behaviors
- **Side Effect Management**: Centralized handling of side effects (API calls, subscriptions, etc.)
- **State Management**: Shared state logic without global state management libraries

---

## 5. `lib/` Directory

### Purpose
The `lib/` directory contains **utility functions**, **service layer code**, **helper functions**, and **shared business logic** that is used across the application. This is the **service layer** of the application architecture.

### What Files Are Expected Inside

#### **Database Utilities**
- **`mongodb.ts`**: MongoDB connection management
  - Singleton pattern for database connection
  - Connection pooling and reuse
  - Error handling and reconnection logic
  - Used by API routes and scripts

#### **Service Layer**
- **`blogService.ts`**: Blog-related business logic
  - Blog post CRUD operations
  - Slug generation, validation
  - Content processing

- **`pollService.ts`**: Polling system business logic
  - Vote processing and validation
  - Poll result calculations
  - Vote deduplication logic

#### **Utility Functions**
- **`slugify.ts`**: String manipulation utilities
  - Converts strings to URL-friendly slugs
  - Used for generating SEO-friendly URLs

- **`time.ts`**: Date/time utilities
  - Date formatting, parsing
  - Timezone handling

- **`getClientIp.ts`**: Network utilities
  - Extracts client IP address from requests
  - Used for analytics, rate limiting

#### **Data Processing**
- **`getBlunderData.ts`**: Data analysis and processing
  - Fetches and processes error/analysis data
  - Data transformation logic

### Why It Is Separated Like This

1. **Service Layer Pattern**: Business logic is separated from API routes (controllers) and components (presentation), following layered architecture principles.

2. **Reusability**: Utility functions can be imported by API routes, components, scripts, and other services.

3. **Testability**: Pure functions and services can be unit tested independently.

4. **Single Responsibility**: Each file has a focused purpose (database, blog, polls, utilities).

5. **Dependency Management**: Centralized connection management (MongoDB) prevents connection leaks and improves performance.

6. **Abstraction**: Provides abstraction over external dependencies (database, third-party APIs).

### How It Interacts with Other Folders

- **Imported by API Routes**: API routes use services for business logic
  ```typescript
  import connectDB from '@/lib/mongodb';
  import { blogService } from '@/lib/blogService';
  ```

- **Imported by Components**: Client components may use utility functions
  ```typescript
  import { slugify } from '@/lib/slugify';
  ```

- **Uses Models**: Services interact with Mongoose models from `models/`
  ```typescript
  import Post from '@/models/Post';
  ```

- **Imported by Scripts**: Seed scripts and utilities use services
  ```typescript
  import connectDB from '@/lib/mongodb';
  ```

- **Used by Hooks**: Custom hooks may call service functions
  ```typescript
  import { getBlunderData } from '@/lib/getBlunderData';
  ```

### Architecture Pattern

**Service Layer Pattern** with:
- **Layered Architecture**: Separation between presentation (components), business logic (lib), and data access (models)
- **Dependency Injection**: Services can be easily mocked for testing
- **Singleton Pattern**: Database connection uses singleton to prevent multiple connections
- **Utility Functions**: Pure functions for common operations

---

## 6. `models/` Directory

### Purpose
The `models/` directory contains **Mongoose schemas and TypeScript interfaces** that define the data structure, validation rules, and database interactions for the application's entities. This is the **data access layer** (DAL) of the application.

### What Files Are Expected Inside

#### **Mongoose Models** (One file per entity)
- **`Admin.ts`**: Administrator user model
  - Authentication credentials
  - Role and permissions
  - Profile information

- **`Candidate2026.ts`**: 2026 election candidate model
  - Candidate information
  - Party affiliations
  - Electoral data

- **`InfoCandidate.ts`**: Detailed candidate information model
  - Personal information
  - Family details
  - Controversy records
  - Media assets

- **`Constituency.ts`**: Electoral constituency model
  - Geographic information
  - Voter statistics
  - Historical data

- **`ConstituencyResult.ts`**: Election result model
  - Vote counts
  - Winner information
  - Turnout statistics

- **`Election.ts`**: Election event model
  - Election metadata
  - Date and parliament number
  - Candidate lists

- **`Party2026.ts`**: Political party model
  - Party information
  - Symbols and logos
  - Manifestos

- **`PartyAlliance.ts`**: Party alliance/coalition model
  - Alliance members
  - Joint manifestos

- **`Poll.ts`**: User poll model
  - Poll questions
  - Options and metadata
  - Multilingual support

- **`PollVote.ts`**: Poll vote record model
  - User identification (fingerprint)
  - Vote selections
  - Timestamp

- **`Post.ts`**: Blog post model
  - Content and metadata
  - Rich text content
  - SEO fields

- **`ContactMessage.ts`**: Contact form submission model
  - User messages
  - Contact information

- **`FingerprintLog.ts`**: User fingerprint tracking model
  - Visitor identification
  - Analytics data

- **`Parliament.ts`**: Parliament session model
  - Parliament metadata
  - Seating arrangements

### Why It Is Separated Like This

1. **Single Responsibility**: Each model file represents one database collection/entity, following the Single Responsibility Principle.

2. **Type Safety**: TypeScript interfaces provide compile-time type checking for database documents.

3. **Validation**: Mongoose schemas define validation rules, ensuring data integrity at the database level.

4. **Reusability**: Models can be imported by API routes, services, and scripts without duplication.

5. **Database Abstraction**: Models abstract away MongoDB-specific details, providing a clean API for data operations.

6. **Schema Evolution**: Centralized schema definitions make it easier to manage database migrations and schema changes.

### How It Interacts with Other Folders

- **Imported by API Routes**: API routes use models for CRUD operations
  ```typescript
  import InfoCandidate from '@/models/InfoCandidate';
  const candidates = await InfoCandidate.find({});
  ```

- **Imported by Services**: Service layer uses models for business logic
  ```typescript
  import Post from '@/models/Post';
  ```

- **Imported by Scripts**: Seed scripts use models to create initial data
  ```typescript
  import Candidate2026 from '@/models/Candidate2026';
  ```

- **Type Exports**: Models export TypeScript interfaces used by components and API routes
  ```typescript
  import { ICandidate2026 } from '@/models/Candidate2026';
  ```

- **Used with Database Connection**: Models require `lib/mongodb.ts` connection to function
  ```typescript
  import connectDB from '@/lib/mongodb';
  await connectDB(); // Required before using models
  ```

### Architecture Pattern

**Data Access Layer (DAL) Pattern** with:
- **ORM/ODM Pattern**: Mongoose provides Object-Document Mapping for MongoDB
- **Active Record Pattern**: Models contain both data and methods to manipulate data
- **Repository Pattern**: Models act as repositories for database collections
- **Schema-First Design**: Database structure defined in code, ensuring consistency

---

## 7. `scripts/` Directory

### Purpose
The `scripts/` directory contains **standalone utility scripts**, **database seeding scripts**, **migration scripts**, and **one-off data processing scripts** that are run independently of the main application (typically via command line or scheduled tasks).

### What Files Are Expected Inside

#### **Seed Scripts**
- **`seedData.ts`**: Main data seeding script
  - Seeds initial election data
  - Creates sample records for development/testing

- **`seedAdminData.ts`**: Administrator account creation
  - Creates default admin users
  - Sets up authentication credentials

- **`runAdminSeed.ts`**: Admin seeding runner
  - Executable script for admin data seeding

- **`seedConstituencies.ts`**: Constituency data seeding
  - Populates constituency information
  - Geographic and electoral data

- **`seedConstituencyResults.ts`**: Election result seeding
  - Historical election results
  - Vote counts and statistics

- **`seedPartyAlliances.ts`**: Party alliance data seeding
  - Coalition information
  - Alliance relationships

- **`comprehensiveSeedData.ts`**: Complete database initialization
  - Orchestrates all seeding operations
  - Ensures data consistency

### Why It Is Separated Like This

1. **Separation of Concerns**: Scripts are separate from application code, making it clear they are not part of the runtime application.

2. **Reusability**: Scripts can be run independently, via npm scripts, or scheduled tasks (cron jobs).

3. **Development Workflow**: Seed scripts are essential for setting up development environments and testing.

4. **Maintenance**: Database initialization and migration logic is centralized and version-controlled.

5. **Automation**: Scripts can be integrated into CI/CD pipelines for automated database setup.

6. **One-Off Operations**: Scripts handle tasks that don't fit into the normal request/response cycle.

### How It Interacts with Other Folders

- **Imports Models**: Scripts use models to create database records
  ```typescript
  import Candidate2026 from '@/models/Candidate2026';
  import Election from '@/models/Election';
  ```

- **Uses Database Connection**: Scripts require database connection from `lib/`
  ```typescript
  import connectDB from '@/lib/mongodb';
  await connectDB();
  ```

- **May Use Services**: Complex seeding may use service layer functions
  ```typescript
  import { blogService } from '@/lib/blogService';
  ```

- **Imports Static Data**: Scripts may import reference data from `data/`
  ```typescript
  import { constituencyData } from '@/data/constituencyData';
  ```

- **Executed via API Routes**: Some scripts are exposed as API endpoints for remote execution
  ```typescript
  // app/api/seed/route.ts may call scripts/seedData.ts
  ```

### Architecture Pattern

**Script-Based Architecture**:
- **Standalone Execution**: Scripts run independently of the web server
- **Idempotent Operations**: Seed scripts should be safe to run multiple times
- **Data Migration Pattern**: Scripts handle database schema and data migrations
- **Development Tooling**: Essential for developer onboarding and environment setup

---

## 8. `types/` Directory

### Purpose
The `types/` directory contains **TypeScript type definitions**, **interfaces**, **type declarations**, and **global type augmentations** that provide type safety across the application. This is the **type system layer** of the application.

### What Files Are Expected Inside

#### **Domain Type Definitions**
- **`poll.ts`**: Poll-related types
  - `PollDTO` - Poll data transfer object
  - `PollQuestion` - Poll question structure
  - `PollOption` - Poll option structure
  - `LocaleKey` - Language locale types

- **`post.ts`**: Blog post types
  - Post data structures
  - Content types
  - Metadata types

#### **Global Type Declarations**
- **`global.d.ts`**: Global type augmentations
  - Extends global TypeScript types
  - Adds custom types to global scope
  - Environment variable types

#### **Third-Party Type Augmentations**
- **`react-hook-form.d.ts`**: React Hook Form type extensions
  - Custom form field types
  - Validation rule types
  - Form state types

### Why It Is Separated Like This

1. **Type Safety**: Centralized type definitions ensure consistency across the application and catch errors at compile time.

2. **Reusability**: Types can be imported by components, API routes, services, and models, ensuring consistent data structures.

3. **Documentation**: Types serve as inline documentation, making it clear what data structures are expected.

4. **IDE Support**: TypeScript types provide autocomplete, refactoring support, and error detection in IDEs.

5. **API Contracts**: Types define contracts between frontend and backend, ensuring API responses match expected structures.

6. **Maintainability**: Changes to data structures are reflected in types, making refactoring safer and easier.

### How It Interacts with Other Folders

- **Imported by Components**: Components use types for props and state
  ```typescript
  import { PollDTO } from '@/types/poll';
  interface PollProps {
    poll: PollDTO;
  }
  ```

- **Imported by API Routes**: API routes use types for request/response validation
  ```typescript
  import { PollDTO } from '@/types/poll';
  return NextResponse.json<PollDTO>(pollData);
  ```

- **Imported by Services**: Services use types for function parameters and return values
  ```typescript
  import { PollDTO } from '@/types/poll';
  export async function getPoll(slug: string): Promise<PollDTO> { }
  ```

- **Imported by Models**: Models may export types that are also defined in `types/` for consistency
  ```typescript
  // Models export interfaces, types/ may re-export or extend them
  ```

- **Used by Hooks**: Custom hooks use types for return values and parameters
  ```typescript
  import { PollDTO } from '@/types/poll';
  ```

### Architecture Pattern

**Type-Driven Development**:
- **Type-First Design**: Types define the structure before implementation
- **Contract Definition**: Types serve as contracts between layers
- **Type Safety**: Compile-time error detection
- **Documentation as Code**: Types document expected data structures

---

## Overall Architecture Summary

### Architecture Pattern
This project follows a **Layered Architecture** with **Feature-Based Organization**:

1. **Presentation Layer** (`components/`, `app/` pages)
   - React components and UI
   - Server and client components
   - User interaction handling

2. **API/Controller Layer** (`app/api/`)
   - RESTful API endpoints
   - Request/response handling
   - Authentication/authorization

3. **Service Layer** (`lib/`)
   - Business logic
   - Utility functions
   - External service integration

4. **Data Access Layer** (`models/`)
   - Database schemas
   - Data validation
   - Database operations

5. **Type System** (`types/`)
   - Type definitions
   - Interface contracts
   - Type safety

6. **Supporting Layers**:
   - **Hooks** (`hooks/`): Reusable stateful logic
   - **Data** (`data/`): Static/reference data
   - **Scripts** (`scripts/`): Utility and seeding scripts

### Key Architectural Principles

1. **Separation of Concerns**: Each layer has a distinct responsibility
2. **Dependency Direction**: Dependencies flow downward (components → services → models)
3. **Reusability**: Shared logic extracted into hooks, services, and utilities
4. **Type Safety**: TypeScript ensures type safety across all layers
5. **Scalability**: Structure supports growth and feature addition
6. **Maintainability**: Clear organization makes code easy to understand and modify

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT-based system
- **Deployment**: Vercel (inferred from Next.js)

---

## Best Practices Demonstrated

1. ✅ **File-based routing** with Next.js App Router
2. ✅ **Type safety** with TypeScript throughout
3. ✅ **Component reusability** with custom hooks and shared components
4. ✅ **Service layer** separation for business logic
5. ✅ **Database abstraction** with Mongoose models
6. ✅ **API route organization** by feature
7. ✅ **Environment configuration** with environment variables
8. ✅ **Code organization** by concern and feature

---

## Recommendations for Future Development

1. **Testing**: Add unit tests for services, hooks, and utilities
2. **API Documentation**: Consider OpenAPI/Swagger for API documentation
3. **Error Handling**: Centralize error handling with custom error classes
4. **Validation**: Add runtime validation (Zod, Yup) for API inputs
5. **Caching**: Implement caching strategy for frequently accessed data
6. **Logging**: Add structured logging for production debugging
7. **Monitoring**: Integrate application performance monitoring (APM)

---

*Document generated based on project structure analysis*
*Last Updated: 2024*

