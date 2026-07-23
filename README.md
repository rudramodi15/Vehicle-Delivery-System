# AutoPulse — Next-Generation Fleet & Dealership Operations Portal

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-TDD-C21325?style=for-the-badge&logo=jest&logoColor=white)

**AutoPulse** is a modern full-stack web application engineered for managing luxury car dealership inventories, vehicle acquisitions, and real-time fleet operations. Built with a robust **Node.js/Express REST API** backend and an **Obsidian Dark React SPA** frontend organized under a scalable **Domain-Driven Feature Module Architecture**.

---

## 🌟 Key Features

- **🔐 Dual-Role Authentication & Security**: Secure User Sign-In and Registration powered by salted password hashing (`bcryptjs`) and JSON Web Tokens (JWT). Dual-tier RBAC distinguishes Customer actions from Fleet Manager (Admin) privileges.
- **⚡ Real-Time Fleet Inventory Deck**: Interactive vehicle cards displaying MSRP tags, live unit availability badges (In Stock, Low Stock, Sold Out), category tags, and acquisition CTAs.
- **🔍 Multi-Parameter Fleet Filtering**: Real-time filtering by Brand/Make, Model Name, Vehicle Category Class (Sedan, SUV, Truck, Electric, Sports), and Price Range (`minPrice` / `maxPrice`).
- **🛡️ Admin Fleet Management**: Restricted controls allowing Fleet Managers to register new vehicles, adjust stock levels (`Restock`), and remove vehicles from inventory records.
- **🎨 Obsidian Dark UI & Design System**: High-end glassmorphism aesthetic built with TailwindCSS, ambient glowing accents, custom font hierarchy (**Outfit** & **Plus Jakarta Sans**), and micro-animations.
- **🧪 Test-Driven Development (TDD)**: 100% test coverage for core API routes using Jest, Supertest, and `mongodb-memory-server` for isolated database assertions.

---

## 🏗️ Architecture Overview

The codebase is structured around modern modular design principles for backend and frontend independence:

```
Car-Delivery/
├── client/                              # React SPA Frontend (Vite)
│   ├── src/
│   │   ├── services/
│   │   │   └── apiClient.js             # Axios instance with JWT bearer request interceptors
│   │   ├── modules/
│   │   │   └── auth/
│   │   │       ├── AuthSessionContext.jsx # Global Auth state provider & useAuth hook
│   │   │       └── AuthRouteGuard.jsx   # Private route authorization wrapper
│   │   ├── views/
│   │   │   ├── auth/
│   │   │   │   ├── UserSignInView.jsx   # Sign-In Page View
│   │   │   │   └── UserSignUpView.jsx   # Registration Page View
│   │   │   └── fleet/
│   │   │       └── FleetOverviewView.jsx # Fleet Operations Dashboard View
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── HeaderNavigation.jsx # Top navigation bar with logo & user status
│   │   │   └── fleet/
│   │   │       ├── FleetVehicleTile.jsx # Interactive vehicle card component
│   │   │       ├── InventoryQueryBar.jsx # Fleet search & filter parameters bar
│   │   │       └── VehicleRegistrationDialog.jsx # Admin Add Vehicle modal dialog
│   │   ├── index.css                    # Design system tokens, glassmorphism & fonts
│   │   └── App.jsx                      # React Router configuration
│   └── package.json
│
└── server/                              # Node.js / Express REST API Backend
    ├── src/
    │   ├── index.js                     # Server bootstrapper & listener
    │   ├── app.js                       # Express application setup & route mounting
    │   ├── config/
    │   │   └── database.js              # MongoDB Mongoose connection initializer
    │   ├── middlewares/
    │   │   └── verifyAuth.js            # JWT verification & RBAC authorization middlewares
    │   ├── models/
    │   │   ├── userSchema.js            # Mongoose User model (select: false password)
    │   │   └── vehicleSchema.js         # Mongoose Vehicle inventory model
    │   ├── controllers/
    │   │   ├── authController.js        # Registration & Login handlers
    │   │   └── vehicleController.js     # Inventory CRUD, Search & Stock transaction handlers
    │   └── routes/
    │       ├── authRouter.js            # Express router for authentication
    │       └── vehicleRouter.js         # Express router for fleet vehicles
    ├── __tests__/                       # Jest TDD Integration Test Suite
    │   ├── auth.test.js                 # Auth endpoint tests
    │   ├── health.test.js               # System health check tests
    │   └── vehicle.test.js              # Vehicle CRUD & Stock operation tests
    └── package.json
```

---

## 📡 API Endpoints Documentation

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Public | Root API status endpoint |
| `GET` | `/api/health` | Public | System health check endpoint |
| `POST` | `/api/auth/register` | Public | Register a new Customer or Admin account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT Bearer token |
| `GET` | `/api/vehicles` | Authenticated | Retrieve complete vehicle catalog |
| `GET` | `/api/vehicles/search` | Authenticated | Filter vehicles by make, model, category, or price range |
| `POST` | `/api/vehicles` | Authenticated | Add a new vehicle entry to inventory |
| `PUT` | `/api/vehicles/:id` | Authenticated | Update specifications of an existing vehicle |
| `POST` | `/api/vehicles/:id/purchase` | Authenticated | Order/Acquire a vehicle (decrements stock by 1) |
| `POST` | `/api/vehicles/:id/restock` | Fleet Manager | Restock vehicle inventory quantity by specified amount |
| `DELETE` | `/api/vehicles/:id` | Fleet Manager | Remove a vehicle entry from inventory records |

---

## ⚙️ Environment Configuration

### Backend Setup (`server/.env`)
Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/autopulse?retryWrites=true&w=majority
JWT_SECRET=autopulse_super_secret_jwt_key_2026
```

### Frontend Setup (`client/.env`)
Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started & Local Development

### Prerequisites
- Node.js `v18.x` or higher
- npm `v9.x` or higher
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the Repository
```bash
git clone https://github.com/tirthchaudhary/CAR-DELIVERY-INCUBYTE.git
cd CAR-DELIVERY-INCUBYTE
```

### 2. Start the Backend API Server
```bash
cd server
npm install
npm run dev
```
The Express backend server will start listening on `http://localhost:5000`.

### 3. Start the Frontend Application
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`.

---

## 🧪 Running Automated Tests

To execute the Jest integration test suite in an isolated in-memory MongoDB environment:

```bash
cd server
npm test
```

Expected Output:
```
PASS __tests__/vehicle.test.js
PASS __tests__/auth.test.js
PASS __tests__/health.test.js

Test Suites: 3 passed, 3 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        ~13 s
```

---

## 🛠️ Production Build Verification

To verify production bundle compilation for the frontend SPA:

```bash
cd client
npm run build
```

---

## 📜 Development Logs & Prompt History

For full AI transparency and complete architectural rationale, refer to [PROMPTS.md](PROMPTS.md).
