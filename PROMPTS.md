# AutoPulse — AI Tooling & Technical Architecture Prompts

This document records the technical prompt history, architectural decisions, and interview-ready outcomes during the engineering of **AutoPulse — Next-Generation Fleet & Dealership Operations System**.

---

## 1. System Architecture & Project Roadmap

- **Prompt:** *"Can you provide an engineering roadmap to design an enterprise-grade fleet and dealership management system with automated testing, role-based access control, and modern UI aesthetics?"*
  - **Technical Outcome & Rationale:** Received a structured 6-phase engineering roadmap:
    1. **Backend Infrastructure**: Express.js REST API with async database drivers and environment isolation.
    2. **Test-Driven Development (TDD)**: Jest integration suite enforcing Red-Green-Refactor methodologies.
    3. **Data Modeling & Security**: Mongoose schemas with field selection protection (`select: false`), salted password hashing (`bcryptjs`), and JWT bearer authorization.
    4. **RBAC Authorization**: Dual-tier security middleware distinguishing Customer access from Fleet Administrator privileges.
    5. **Frontend Architecture**: React Single Page Application (SPA) structured around a **Domain-Driven Feature Module** design pattern (`services/`, `modules/`, `views/`, `components/`).
    6. **Design System**: Obsidian Dark UI theme featuring glassmorphism, ambient lighting, neon accent badges, and custom Google Fonts (**Outfit** & **Plus Jakarta Sans**).

- **Prompt:** *"Guide me through initializing the root project environment, version control configuration, and dependency setup for the backend service."*
  - **Technical Outcome & Rationale:** Initialized Git version control, configured root `.gitignore` to prevent secret leakage (`.env`, `node_modules/`, build artifacts), and set up `server/package.json` with runtime dependencies (`express`, `cors`, `dotenv`, `mongoose`, `jsonwebtoken`, `bcryptjs`) and dev dependencies (`jest`, `supertest`, `mongodb-memory-server`, `nodemon`).

- **Prompt:** *"How do I ensure transparent attribution when collaborating with AI coding agents according to enterprise standards?"*
  - **Technical Outcome & Rationale:** Adopted Git co-author commit metadata trailers (`Co-authored-by: Agent <AI@users.noreply.github.com>`) to maintain clear commit lineage and evaluation transparency.

---

## 2. Database Design & MongoDB Cloud Cluster Integration

- **Prompt:** *"Why choose MongoDB Mongoose ODM over relational databases for vehicle inventory management, and how do we set up isolated unit testing?"*
  - **Technical Outcome & Rationale:** Selected MongoDB for schema flexibility (handling diverse vehicle specifications, categories, and dynamic queries). Implemented `mongodb-memory-server` for isolated TDD execution, ensuring tests run in-memory in milliseconds without relying on external network databases or mutating persistent production data.

- **Prompt:** *"What are the exact steps to provision a cloud MongoDB Atlas cluster and connect via connection strings?"*
  - **Technical Outcome & Rationale:** Created a cloud cluster on MongoDB Atlas, created an authenticated database user, whitelisted API server access (`0.0.0.0/0`), and stored the connection URI inside `server/.env`.

- **Prompt:** *"Why are environment variables stored in a server-side `.env` file instead of shared globally with the frontend client?"*
  - **Technical Outcome & Rationale:** Enforced zero-trust security boundaries: server `.env` files contain sensitive credentials (database connection strings, JWT signing keys) that must never be exposed to browser bundles or client-side JavaScript.

- **Prompt:** *"How do we design `database.js` to handle asynchronous database connection lifecycle and handle network drops gracefully?"*
  - **Technical Outcome & Rationale:** Created an async database module using `mongoose.connect()` inside `src/config/database.js` that catches connection errors during boot and handles process exits cleanly.

---

## 3. Security, JWT Authentication & TDD Suite

- **Prompt:** *"Explain the TDD test lifecycle hooks (`beforeAll`, `beforeEach`, `afterAll`) when testing authentication endpoints."*
  - **Technical Outcome & Rationale:** 
    - `beforeAll`: Starts the in-memory MongoDB instance and establishes the Mongoose connection once for the test suite.
    - `beforeEach`: Cleans database collections (`User.deleteMany({})`) to prevent test pollution across assertions.
    - `afterAll`: Drops the test database, disconnects Mongoose, and stops `MongoMemoryServer` cleanly.

- **Prompt:** *"How do we configure `userSchema.js` so user password hashes are excluded from database query projections by default?"*
  - **Technical Outcome & Rationale:** Configured `select: false` on the `password` path in `userSchema.js`. In controller methods where authentication is performed (such as `login`), `.select('+password')` is explicitly chained to compare passwords while keeping all other API responses sanitized.

- **Prompt:** *"Walk through the execution flow of `verifyAuth.js` middleware for Bearer token verification."*
  - **Technical Outcome & Rationale:** `authenticateUser` extracts the `Authorization` header, validates the `Bearer <token>` format, verifies the cryptographic signature with `jwt.verify()`, and attaches decoded user payload to `req.user`.

- **Prompt:** *"How does `authAdmin` enforce Role-Based Access Control (RBAC) on administrative endpoints?"*
  - **Technical Outcome & Rationale:** `authAdmin` inspects `req.user.role`. If the role is not `'admin'`, it halts request execution immediately and returns a `403 Forbidden` JSON error response, protecting sensitive operations (adding, restocking, or deleting fleet vehicles).

---

## 4. Fleet & Vehicle API Controller Implementation

- **Prompt:** *"Explain the dynamic search and filter query builder inside `vehicleController.js`."*
  - **Technical Outcome & Rationale:** `searchVehicles` parses query parameters (`make`, `model`, `category`, `minPrice`, `maxPrice`) and dynamically builds a Mongoose filter object:
    - Case-insensitive regex matching for text fields (`$regex`, `$options: 'i'`).
    - Numeric comparison operators (`$gte`, `$lte`) for price ranges.

- **Prompt:** *"Why must query parameters like `minPrice` and `maxPrice` be explicitly converted using `Number()` in Express controllers?"*
  - **Technical Outcome & Rationale:** Express parses URL query parameters as strings (`"50000"`). Converting them via `Number()` is required so MongoDB performs numerical comparisons rather than lexicographical string comparisons (where `"100000"` < `"25000"`).

- **Prompt:** *"How does the `purchaseVehicle` transaction endpoint guarantee stock safety?"*
  - **Technical Outcome & Rationale:** `purchaseVehicle` checks if `vehicle.quantity <= 0`. If out of stock, it returns `400 Bad Request`. Otherwise, it decrements `quantity` by `1` and persists the updated document.

---

## 5. React SPA Feature-Module Frontend & Design System

- **Prompt:** *"How is the frontend architecture structured to support scalable, maintainable enterprise growth?"*
  - **Technical Outcome & Rationale:** Organized `client/src` into a **Domain-Driven Feature Module** pattern:
    - `src/services/apiClient.js`: Axios instance with request interceptors for automatic JWT header injection.
    - `src/modules/auth/`: Context providers (`AuthSessionContext.jsx`) and route guards (`AuthRouteGuard.jsx`).
    - `src/views/`: Page-level views (`UserSignInView.jsx`, `UserSignUpView.jsx`, `FleetOverviewView.jsx`).
    - `src/components/`: Reusable UI elements split by domain (`common/HeaderNavigation.jsx`, `fleet/FleetVehicleTile.jsx`, `fleet/InventoryQueryBar.jsx`, `fleet/VehicleRegistrationDialog.jsx`).

- **Prompt:** *"How does Axios request interceptor automate JWT authentication across all API calls?"*
  - **Technical Outcome & Rationale:** `apiClient.interceptors.request.use()` intercepts outgoing HTTP calls, checks `localStorage` for `token`, and appends `Authorization: Bearer <token>` to request headers before forwarding them to Express.

- **Prompt:** *"Explain React's 'Lifting State Up' pattern in `InventoryQueryBar` and `FleetOverviewView`."*
  - **Technical Outcome & Rationale:** Filter parameter state originates in `InventoryQueryBar`. Upon form submission, filters are passed up to `FleetOverviewView` via an `onSearch` callback prop, triggering `apiClient.get('/vehicles/search?...')` and re-rendering the vehicle grid deck.

- **Prompt:** *"What design choices drive the AutoPulse Obsidian Dark UI design system?"*
  - **Technical Outcome & Rationale:** Built a luxury high-tech visual identity using:
    - Base obsidian background (`#080C14` / `#0F172A`).
    - Glassmorphism backdrop blur (`backdrop-blur-xl`, `glass-panel`).
    - Neon electric cyan (`#06B6D4`) and emerald (`#10B981`) badges and ambient glows.
    - Responsive grid card deck with stock indicators and hover zoom elevations.

---

## 6. Code Refactoring & System Verification

- **Prompt:** *"How was the full-stack system verified for production readiness?"*
  - **Technical Outcome & Rationale:**
    - **Backend Jest Suite**: Executed `npm test` inside `server/`, passing all 13 test suites (Auth, Vehicle CRUD, RBAC, Health).
    - **Frontend Vite Build**: Executed `npm run build` inside `client/`, compiling 1662 modules into production bundles in `6.87s` with 0 errors.
