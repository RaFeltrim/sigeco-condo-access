# SIGECO - System Architecture Documentation

> **Complete folder and file-level architecture documentation for the SIGECO Condominium Access Management System**

**Last Updated:** January 13, 2025  
**Version:** 1.0.0

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Frontend Architecture (`/src`)](#frontend-architecture-src)
- [Backend Architecture (`/backend`)](#backend-architecture-backend)
- [Testing Architecture (`/tests`)](#testing-architecture-tests)
- [Configuration Files](#configuration-files)
- [Build & Deployment](#build--deployment)

---

## Project Overview

SIGECO is a full-stack web application designed to manage visitor access in condominiums. The system is architected as a monorepo with separate frontend and backend codebases, using modern TypeScript-based tooling throughout.

### Key Architectural Decisions

1. **Monorepo Structure** - Frontend and backend coexist in a single repository
2. **Type Safety** - TypeScript used across the entire stack
3. **Component-Driven UI** - React with shadcn-ui component library
4. **Service Layer Pattern** - Business logic isolated in dedicated service modules
5. **Multi-Framework Testing** - Comprehensive testing with Vitest, Playwright, and Cypress

---

## Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | 5.8.3 | Type safety |
| Vite | 6.4.1 | Build tool & dev server |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| shadcn-ui | Latest | Component library (Radix UI primitives) |
| React Router | 6.30.1 | Client-side routing |
| TanStack Query | 5.83.0 | Server state management |
| React Hook Form | 7.61.1 | Form management |
| Zod | 3.25.76 | Schema validation |

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 4.21.2 | HTTP server framework |
| Prisma | 5.22.0 | Database ORM |
| TypeScript | 5.8.3 | Type safety |
| JWT | 9.0.2 | Authentication |
| Socket.IO | 4.8.1 | Real-time communication |
| Helmet | 8.0.0 | Security middleware |

### Testing & Quality
| Tool | Version | Purpose |
|------|---------|---------|
| Vitest | 4.0.7 | Unit testing |
| Playwright | 1.56.1 | E2E testing |
| Cypress | 15.6.0 | Component & E2E testing |
| ESLint | 9.32.0 | Code linting |
| MSW | 2.12.0 | API mocking |

---

## Project Structure

```
sigeco-condo-access/
├── backend/                 # Backend API application
├── cypress/                 # Cypress test configuration
├── docs/                    # Documentation files
├── examples/                # Usage examples
├── public/                  # Static assets
├── scripts/                 # Build & validation scripts
├── src/                     # Frontend application source
├── tests/                   # Test suites
├── .github/                 # GitHub Actions workflows
├── .kiro/                   # MVP verification & reports
└── [config files]           # Root-level configuration
```

---

## Frontend Architecture (`/src`)

The frontend follows a feature-based organization with clear separation of concerns.

### Directory Overview

```
src/
├── components/              # React components
├── hooks/                   # Custom React hooks
├── lib/                     # Shared utilities & libraries
├── pages/                   # Page-level components (routes)
├── services/                # Business logic & API communication
├── types/                   # TypeScript type definitions
├── App.tsx                  # Root application component
├── main.tsx                 # Application entry point
└── vite-env.d.ts            # Vite environment types
```

---

### `/src/components` - UI Components

**Purpose:** Contains all React components organized by feature area and UI primitives.

#### **`/src/components/ui/`** (52 files)
The UI component library built on shadcn-ui and Radix UI primitives. All components follow the shadcn-ui conventions.

**Key Files:**
- `button.tsx` - Customizable button component with variants (default, destructive, outline, ghost, link)
- `card.tsx` - Card container components (Card, CardHeader, CardContent, CardFooter)
- `dialog.tsx` - Modal dialog component for overlays
- `table.tsx` - Table components for data display
- `form.tsx` - Form wrapper components with React Hook Form integration
- `input.tsx` - Text input field component
- `select.tsx` - Dropdown select component
- `toast.tsx` & `sonner.tsx` - Toast notification systems
- `sidebar.tsx` - Application sidebar navigation
- `badge.tsx` - Status badge component
- `calendar.tsx` - Date picker calendar component
- `dropdown-menu.tsx` - Contextual dropdown menus
- `tabs.tsx` - Tab navigation component
- `scroll-area.tsx` - Custom scrollable containers

**Pattern:** Each UI component exports its main component and sub-components (e.g., `Card`, `CardHeader`, `CardContent`)

#### **`/src/components/access/`** (2 files)
Access control related components.

- `AccessLog.tsx` - Access log listing and filtering interface
- `AccessControl.tsx` - Access control panel for doorman

#### **`/src/components/reports/`** (2 files)
Reporting functionality components.

- `ReportGenerator.tsx` - Report configuration and generation interface
- `ReportViewer.tsx` - Report preview and export (PDF/Excel)

#### **`/src/components/visitor/`** (7 files)
Visitor management components (core feature).

- `VisitorForm.tsx` - Visitor registration form with validation
- `VisitorList.tsx` - Visitor listing with search and filtering
- `VisitorCard.tsx` - Individual visitor card display
- `VisitorSearch.tsx` - Advanced visitor search component
- `QuickCheckout.tsx` - Fast visitor checkout interface
- `VisitorStats.tsx` - Visitor statistics dashboard widget
- `VisitorDetails.tsx` - Detailed visitor information view

#### **`/src/components/user/`** (2 files)
User management components.

- `UserForm.tsx` - User creation/editing form
- `UserList.tsx` - User listing and management interface

#### **Root-level Components**
- `ErrorBoundary.tsx` - Global error boundary for error handling
- `ErrorFallback.tsx` - Fallback UI displayed when errors occur
- `Logo.tsx` - Application logo component
- `NotificationSystem.tsx` - Global notification system
- `ActivityLoggerIndicator.tsx` - Development tool for activity logging

---

###  `/src/hooks` - Custom React Hooks

**Purpose:** Reusable stateful logic encapsulated as custom hooks.

**Key Files:**
- `useVisitorSearch.ts` - Visitor search logic with debouncing and filtering
- `useVisitorStorage.ts` - Local storage persistence for visitor data
- `useToast.ts` - Toast notification hook (shadcn-ui)
- `useReportGeneration.ts` - Report generation workflow logic
- `useUserActivityLogger.ts` - User activity tracking (development)
- `useDocumentInput.ts` - Document input formatting and validation
- `useNameInput.ts` - Name input formatting and validation
- `use-mobile.tsx` - Mobile device detection hook

**Pattern:** Hooks follow the `use` prefix naming convention and encapsulate both state and side effects.

---

### `/src/lib` - Shared Libraries & Utilities

**Purpose:** Shared utilities, constants, validators, and business logic helpers.

#### **`/src/lib/api/`** (7 files)
API client modules for backend communication.

- `apiClient.ts` - Axios instance configuration (base URL, interceptors)
- `visitorApi.ts` - Visitor-related API endpoints
- `userApi.ts` - User management API endpoints
- `reportApi.ts` - Report generation API endpoints
- `authApi.ts` - Authentication API endpoints
- `analyticsApi.ts` - Analytics and metrics API
- `backupApi.ts` - Backup and restore API endpoints

**Pattern:** Each API module exports typed functions that return Promises with proper TypeScript types.

#### **`/src/lib/validators/`** (3 files + 1 dir)
Zod schema validators for form and data validation.

- `visitorValidator.ts` - Visitor form validation schemas
- `userValidator.ts` - User form validation schemas
- `reportValidator.ts` - Report configuration validation schemas

#### **`/src/lib/constants/`** (2 files)
Application-wide constants.

- `routes.ts` - Application route definitions
- `config.ts` - Application configuration constants

#### **`/src/lib/formatters/`** (1 file + 1 dir)
Data formatting utilities.

- `dateFormatter.ts` - Date/time formatting functions
- `documentFormatter.ts` - CPF/CNPJ formatting
- `currencyFormatter.ts` - Currency formatting

#### **`/src/lib/storage/`** (1 file)
Local storage management.

- `localStorage.ts` - Type-safe localStorage wrapper with data pruning

#### **`/src/lib/mvp-verifier/`** (3 files + 1 dir)
MVP verification system for project completeness analysis.

- `index.ts` - Main verification engine
- `analyzers.ts` - Code analyzers (components, features, quality)
- `reporters.ts` - Report generation (JSON, Markdown)

#### **`/src/lib/validation-agents/`** (11 files)
Automated validation agents for system testing.

- `DashboardAgent.ts` - Dashboard validation
- `MoradoresAgent.ts` - Residents module validation
- `AgendamentosAgent.ts` - Scheduling module validation
- `RelatoriosAgent.ts` - Reports module validation
- `FuncionariosAgent.ts` - Employees module validation
- `BackupAgent.ts` - Backup module validation
- `SuporteAgent.ts` - Support module validation
- `ValidationEngine.ts` - Core validation orchestration
- `ValidationReporter.ts` - Validation report generation

#### **Root-level Library Files**
- `utils.ts` - General utility functions (classNames, etc.)
- `domHelpers.ts` - DOM manipulation utilities
- `logging.ts` - Logging system with multiple log levels
- `globalErrorHandlers.ts` - Global error handling setup
- `moradores-crud.ts` - Residents CRUD operations
- `agendamentos-crud.ts` - Scheduling CRUD operations

---

### `/src/pages` - Page Components (Routes)

**Purpose:** Top-level page components that correspond to application routes.

**Key Files:**
- `Index.tsx` - Landing/home page
- `Login.tsx` - Authentication login page
- `PorteiroDashboard.tsx` - **Doorman dashboard** (90% complete - production ready)
  - Visitor entry/exit registration
  - Real-time visitor list
  - Quick checkout system
  - Dashboard statistics
- `AdminDashboard.tsx` - **Administrative dashboard** (72% complete)
  - Overview metrics
  - Quick actions
  - System status
- `AgendamentoPage.tsx` - Visit scheduling management page
- `ControleInsumosPage.tsx` - Inventory/supplies control page
- `GerenciamentoMoradoresPage.tsx` - Residents management page
- `RelatoriosPage.tsx` - Reports generation and viewing page
- `SegurancaPage.tsx` - Security & backup management page
- `SuporteAvancadoPage.tsx` - Advanced support page
- `NotFound.tsx` - 404 error page

**Pattern:** Each page is a default export and is lazy-loaded in `App.tsx` routing configuration.

---

### `/src/services` - Business Logic Services

**Purpose:** Encapsulates business logic and orchestrates API calls. Services act as an abstraction layer between components and APIs.

**Key Files:**
- `VisitorService.ts` - Visitor management logic
  - Entry/exit registration
  - Search and filtering
  - Data validation
  - Photo upload handling
- `UserService.ts` - User management logic
  - CRUD operations
  - Role management
  - Permission checks
- `AuthService.ts` - Authentication & authorization
  - Login/logout
  - Token management (JWT)
  - Session persistence
  - Protected route logic
- `ReportService.ts` - Report generation
  - PDF generation (jsPDF)
  - Excel export (xlsx)
  - Data aggregation
  - Template management
- `ReportTemplateService.ts` - Report template management
- `SavedFiltersService.ts` - User saved filter preferences
- `AccessService.ts` - Access control logic
- `AnalyticsService.ts` - Analytics and metrics tracking
- `BackupService.ts` - System backup and restore
- `UserActivityLogger.ts` - User activity tracking for audit

**Pattern:** Services export singleton classes or factory functions. They handle error handling, data transformation, and business rules.

---

### `/src/types` - TypeScript Type Definitions

**Purpose:** Centralized type definitions shared across the application.

**Key Files:**
- `visitor.ts` - Visitor-related types (Visitor, VisitorEntry, VisitorExit)
- `user.ts` - User and authentication types (User, UserRole, AuthState)
- `access.ts` - Access control types (AccessLog, AccessRecord)
- `common.ts` - Shared common types (ApiResponse, PaginatedResponse, etc.)
- `mvp-verifier.ts` - MVP verification system types
- `validation-agents.ts` - Validation agent types
- `index.ts` - Barrel export of all types

**Pattern:** Types are organized by domain/feature and exported via the index barrel file.

---

### Root Application Files

#### **`main.tsx`** - Application Entry Point
- Sets up React 18 with `createRoot`
- Imports global styles (`index.css`)
- Renders the root `<App />` component
- Registers global error handlers

#### **`App.tsx`** - Root Application Component
- Configures application providers:
  - `ErrorBoundary` - Global error handling
  - `QueryClientProvider` - TanStack Query setup
  - `TooltipProvider` - Tooltip context
  - `BrowserRouter` - Routing
- Defines application routes with `<Routes>` and `<Route>`
- Initializes analytics providers
- Sets up notification systems (Toast, Sonner)

#### **`index.css`** - Global Styles
- Tailwind CSS imports (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- CSS custom properties (theme variables)
- Global styles and resets

#### **`App.css`** - Application-specific styles
- Additional component styles not covered by Tailwind

---

## Backend Architecture (`/backend`)

The backend is a REST API built with Express and Prisma ORM.

### Directory Structure

```
backend/
├── prisma/
│   └── seed.ts              # Database seeding script
├── scripts/
│   └── test-endpoints.sh    # API endpoint testing script
├── src/
│   ├── config/              # Configuration modules
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Express middleware
│   ├── routes/              # Route definitions
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── tests/
│   └── api-endpoints.test.ts # API integration tests
├── package.json
└── tsconfig.json
```

---

### `/backend/src/config` - Configuration

**Purpose:** Centralized configuration management.

**Files:**
- `database.ts` - Prisma database connection configuration
- `auth.ts` - JWT and authentication configuration
- `cors.ts` - CORS configuration for allowed origins

---

### `/backend/src/controllers` - Request Controllers

**Purpose:** Handle HTTP requests and responses. Controllers receive requests from routes, call services, and return responses.

**Files (5):**
- `authController.ts` - Authentication endpoints (login, register, token refresh)
- `visitorController.ts` - Visitor management endpoints
- `userController.ts` - User management endpoints
- `reportController.ts` - Report generation endpoints
- `accessController.ts` - Access control endpoints

**Pattern:** Controllers export async functions that receive `(req, res, next)` and handle errors via Express error middleware.

---

### `/backend/src/middleware` - Express Middleware

**Purpose:** Request processing pipeline (authentication, validation, logging).

**Files (3):**
- `authMiddleware.ts` - JWT token verification and user authentication
- `errorMiddleware.ts` - Global error handling and formatting
- `validationMiddleware.ts` - Request body validation using Zod schemas

---

### `/backend/src/routes` - API Routes

**Purpose:** Define API endpoints and attach controllers.

**Files (6):**
- `authRoutes.ts` - `/api/auth/*` - Authentication routes
- `visitorRoutes.ts` - `/api/visitors/*` - Visitor management routes
- `userRoutes.ts` - `/api/users/*` - User management routes
- `reportRoutes.ts` - `/api/reports/*` - Report generation routes
- `accessRoutes.ts` - `/api/access/*` - Access control routes
- `index.ts` - Main router that combines all sub-routers

**Pattern:** Each route file exports an Express Router instance.

---

### `/backend/src` - Core Files

#### **`server.ts`** - Server Entry Point
- Initializes Express app
- Connects to database (Prisma)
- Sets up middleware stack
- Registers routes
- Starts HTTP server (default port: 3000)
- Handles graceful shutdown

#### **`app.ts`** - Express App Configuration
- Creates Express application instance
- Applies security middleware (Helmet)
- Configures CORS
- Sets up request parsing (JSON, URL-encoded)
- Applies rate limiting
- Adds request logging (Morgan)
- Registers API routes
- Applies error handling middleware

---

### `/backend/prisma`

#### **`schema.prisma`** - Database Schema
- Defines all database models (User, Visitor, AccessLog, etc.)
- Configures Prisma Client
- Database relationships and constraints

#### **`seed.ts`** - Database Seeding
- Creates initial data for development/testing
- Sample users, visitors, and access logs

---

## Testing Architecture (`/tests`)

The project uses multiple testing frameworks for comprehensive coverage.

### Directory Structure

```
tests/
├── unit/                    # Unit tests (Vitest)
├── integration/             # Integration tests
├── e2e/                     # E2E tests (Playwright)
├── cypress/                 # Cypress tests
├── accessibility/           # Accessibility tests
├── visual/                  # Visual regression tests
├── contracts/               # Contract tests
├── security/                # Security tests
├── performance/             # Performance tests
├── fixtures/                # Test data fixtures
├── mocks/                   # API mocks (MSW)
├── utils/                   # Test utilities
└── setup.ts                 # Global test setup
```

---

### `/tests/unit` - Unit Tests (Vitest)

**Purpose:** Test individual functions, hooks, and components in isolation.

#### **`/tests/unit/api/`** (6 files)
- Tests for API client modules
- Mock HTTP requests with MSW

#### **`/tests/unit/hooks/`** (4 files)
- Tests for custom React hooks
- Uses `@testing-library/react-hooks`

#### **`/tests/unit/services/`** (3 files)
- Tests for service layer business logic
- Mocked API dependencies

#### **`/tests/unit/utils/`** (11 files)
- Tests for utility functions
- Validators, formatters, helpers

**Pattern:** Unit tests use `describe`, `it`, `expect` from Vitest. Each test file corresponds to a source file (e.g., `utils.ts` → `utils.test.ts`).

---

### `/tests/e2e` - End-to-End Tests (Playwright)

**Purpose:** Test complete user flows from browser perspective.

**Key Files:**
- `admin-dashboard.spec.ts` - Admin dashboard E2E tests
- `admin-overview-functionality.spec.ts` - Admin overview feature tests
- `check-console-errors.spec.ts` - Console error detection test
- `setup.spec.ts` - Test environment setup
- `/moradores/` - Residents module E2E tests

**Pattern:** Each spec file tests a complete user journey (e.g., login → create visitor → checkout).

---

### `/tests/cypress` - Cypress Tests

**Purpose:** Component testing and E2E testing with Cypress.

#### **`/tests/cypress/e2e/`** (6 files)
- `porteiro-dashboard.cy.ts` - Doorman dashboard tests
- `admin-dashboard.cy.ts` - Admin dashboard tests
- `visitor-management.cy.ts` - Visitor CRUD tests
- `report-generation.cy.ts` - Report generation tests
- `user-authentication.cy.ts` - Login/logout tests
- `access-control.cy.ts` - Access control tests

#### **`/tests/cypress/component/`** (3 files + 1 dir)
- Component-level testing for React components
- Isolated component behavior verification

**Pattern:** Cypress tests use `describe`, `it`, `cy.*` commands. Tests are organized by feature/page.

---

### `/tests/fixtures` - Test Data

**Purpose:** Sample data for tests.

**Files:**
- `visitors.ts` - Sample visitor data
- `users.ts` - Sample user data
- `analytics.ts` - Sample analytics data
- `schedules.ts` - Sample scheduling data
- `residents.ts` - Sample resident data
- `inventory.ts` - Sample inventory data
- `notifications.ts` - Sample notification data

---

### `/tests/mocks` - API Mocking (MSW)

**Purpose:** Mock HTTP requests for testing without a live backend.

**Files:**
- `handlers.ts` - MSW request handlers for all API endpoints
- `server.ts` - MSW server for Node.js (Vitest)
- `browser.ts` - MSW worker for browser (Cypress/Playwright)
- `index.ts` - Barrel export

**Pattern:** Handlers define mock responses for each API endpoint. Used across all test frameworks.

---

### `/tests/utils` - Test Utilities

**Purpose:** Shared testing utilities and helpers.

**Files:**
- `test-utils.tsx` - Custom render function with providers
- `render-helpers.tsx` - Component rendering utilities
- `test-helpers.ts` - General test helper functions
- `mock-data.ts` - Mock data generators

---

### Test Configuration Files

#### **`/tests/setup.ts`** - Global Test Setup
- Configures jsdom environment
- Sets up MSW server
- Global test utilities
- Cleanup after each test

#### **Root `/vitest.config.ts`** - Vitest Configuration
- Test file patterns
- Coverage settings
- Environment setup
- Aliases and path resolution

#### **Root `/playwright.config.ts`** - Playwright Configuration
- Browser configurations (Chromium, Firefox, WebKit)
- Base URL (`http://localhost:9323`)
- Test directory (`tests/e2e`)
- Reporter settings
- Web server command

#### **Root `/cypress.config.ts`** - Cypress Configuration
- E2E and component test settings
- Base URL
- Viewport dimensions
- Video and screenshot settings
- Plugin configuration

---

## Configuration Files

### Build & Development

#### **`vite.config.ts`**
- Dev server configuration (port 9323)
- React plugin with SWC
- Path aliases (`@/` → `./src/`)
- Lovable tagger (development mode)

#### **`tsconfig.json`**
- Root TypeScript configuration
- References app, node, and test configs
- Path mapping for `@/*` aliases
- Compiler options (strict mode disabled for gradual migration)

#### **`tsconfig.app.json`**
- TypeScript config for application code
- Includes `src/` directory
- JSX: React

#### **`tsconfig.node.json`**
- TypeScript config for Node.js scripts (Vite, etc.)
- Includes config files

#### **`tsconfig.test.json`**
- TypeScript config for tests
- Includes `tests/` directory
- Additional test types

---

### Styling & UI

#### **`tailwind.config.ts`**
- Tailwind CSS configuration
- Custom theme colors and typography
- Content paths for purging
- Plugins (tailwindcss-animate, @tailwindcss/typography)

#### **`postcss.config.js`**
- PostCSS configuration
- Tailwind CSS and Autoprefixer plugins

#### **`components.json`**
- shadcn-ui configuration
- Component installation path (`src/components/ui`)
- Styling approach (Tailwind)
- Aliases

---

### Linting & Code Quality

#### **`eslint.config.js`**
- ESLint configuration (v9 flat config)
- React and TypeScript rules
- React Hooks plugin
- React Refresh rules

---

### Package Management

#### **`package.json`** (Root)
- Project metadata
- npm scripts (dev, build, test, validate)
- Dependencies and devDependencies
- See [Tech Stack](#technology-stack) for versions

#### **`backend/package.json`**
- Backend-specific dependencies
- Backend npm scripts
- Prisma configuration

---

### Environment Variables

#### **`.env.example`**
- Template for environment variables
- Database URL
- JWT secret
- API endpoints
- Feature flags

**Note:** Actual `.env` file is gitignored and must be created locally.

---

## Build & Deployment

### Development Build

```bash
npm run dev
```

- Starts Vite dev server on port 9323
- Hot Module Replacement (HMR) enabled
- Source maps enabled

### Production Build

```bash
npm run build
```

- TypeScript compilation with `tsc` (type checking)
- Vite production build
- Output directory: `dist/`
- Optimizations: minification, code splitting, tree shaking

### Build Output Structure

```
dist/
├── assets/
│   ├── index-[hash].js       # Main application bundle
│   ├── vendor-[hash].js      # Third-party dependencies
│   └── [component]-[hash].js # Code-split chunks
├── index.html                # Entry HTML
└── robots.txt                # SEO robots file
```

---

## Key Architectural Patterns

### 1. **Service Layer Pattern**
Business logic is encapsulated in service modules (`/src/services`), not in components. Components call services, services call APIs.

### 2. **Custom Hooks for Reusable Logic**
Stateful logic is extracted into custom hooks (`/src/hooks`), making it reusable across components.

### 3. **Centralized Type Definitions**
All TypeScript types are defined in `/src/types` and exported via barrel files.

### 4. **API Client Abstraction**
All HTTP requests go through typed API client modules (`/src/lib/api`), not directly from components.

### 5. **Atomic Design for UI Components**
UI components (`/src/components/ui`) are atomic, reusable, and composable.

### 6. **Feature-Based Organization**
Components, services, and types are grouped by feature (visitor, user, access, reports).

### 7. **Error Boundaries**
Global and feature-level error boundaries catch and handle React errors gracefully.

### 8. **Form Management with React Hook Form + Zod**
Forms use React Hook Form for state management and Zod for validation schemas.

---

## Data Flow

```
User Interaction
    ↓
Component (React)
    ↓
Custom Hook (if needed)
    ↓
Service Layer
    ↓
API Client
    ↓
Backend API (Express)
    ↓
Controller
    ↓
Prisma ORM
    ↓
Database
```

---

## Security Architecture

### Frontend Security
- **Input Validation:** All user inputs validated with Zod schemas
- **XSS Prevention:** React's built-in XSS protection + DOMPurify for rich text
- **CSRF Protection:** Token-based authentication (JWT)
- **Secure Storage:** Sensitive data never stored in localStorage (tokens in memory/httpOnly cookies)

### Backend Security
- **Helmet:** HTTP security headers
- **Rate Limiting:** Express rate limiter on all endpoints
- **CORS:** Configured allowed origins
- **JWT Authentication:** Token-based auth with refresh tokens
- **Input Validation:** Zod schemas on all request bodies
- **SQL Injection Prevention:** Prisma ORM parameterized queries

---

## Performance Optimization

### Frontend
- **Code Splitting:** Dynamic imports for routes (lazy loading)
- **Tree Shaking:** Vite automatically removes unused code
- **Image Optimization:** Lazy loading for images
- **Bundle Analysis:** Vite build analyzer for identifying large chunks
- **Caching:** TanStack Query for server state caching

### Backend
- **Database Indexing:** Prisma schema defines indexes on frequently queried fields
- **Query Optimization:** Efficient Prisma queries with `select` and `include`
- **Compression:** gzip compression middleware
- **Connection Pooling:** Prisma connection pooling

---

## Testing Strategy

### Test Pyramid
```
        /\
       /  \      E2E Tests (Playwright, Cypress)
      /----\     Integration Tests (Vitest + MSW)
     /      \    
    /________\   Unit Tests (Vitest)
```

- **Unit Tests:** ~60% coverage target
- **Integration Tests:** ~25% coverage target
- **E2E Tests:** ~15% coverage target

### Testing Tools by Layer
- **Unit:** Vitest + React Testing Library
- **Integration:** Vitest + MSW (API mocking)
- **E2E:** Playwright (primary), Cypress (component + E2E)
- **Accessibility:** jest-axe, axe-core
- **Visual Regression:** Playwright visual comparisons

---

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature development branches
- `fix/*` - Bug fix branches

### Definition of Done
See [CONTRIBUTING.md](../CONTRIBUTING.md) for complete DoD checklist. Key points:
- Code passes `npm run validate` (type-check + lint + build)
- Console errors checked in browser (F12)
- Functional tests pass
- Documentation updated
- Code reviewed

---

## Further Reading

- **[SETUP.md](./SETUP.md)** - Environment setup guide
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow & scripts
- **[TESTING.md](./TESTING.md)** - Testing guide
- **[API.md](./API.md)** - Backend API documentation
- **[FEATURES.md](./FEATURES.md)** - Feature documentation
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines

---

**This document provides a comprehensive overview of the SIGECO architecture. For specific implementation details, refer to inline code comments and the referenced documentation files.**

---

<div align="center">

**SIGECO Architecture Documentation v1.0.0**  
*Last Updated: January 13, 2025*

</div>
