# Vistra DMS — Document Management System

A high-performance, full-stack Document Management System (DMS) built for efficient folder organization and document record tracking.

## 🚀 Overview

This project provides a robust solution for managing virtual directory structures and document metadata. It features a modern, responsive user interface and a scalable, type-safe backend architecture.

## 🛠️ Technology Stack

### Backend
- **Node.js 22** — Modern runtime environment.
- **Express 5** — Fast, unopinionated web framework.
- **TypeScript 6** — Enhanced type safety and developer productivity.
- **MySQL 8** — Reliable relational database storage.
- **Zod** — Schema validation with static type inference.
- **ESLint** — Strict code quality and formatting standards.

### Frontend
- **Next.js 16 (App Router)** — React framework for the modern web.
- **React 19** — The library for web and native user interfaces.
- **TanStack Query (v5)** — Powerful asynchronous state management.
- **Tailwind CSS 4** — Utility-first CSS framework for rapid UI development.
- **React Hook Form** — Performant, flexible, and extensible forms.

## 🏛️ Architecture

The Document Management System is structured as a decoupled full-stack application:
- **Frontend (Next.js)**: Responsible for the user interface, rendering, and state management. Next.js was chosen for its robust ecosystem, built-in optimizations, and App Router capabilities.
- **Backend (Node.js/Express)**: Acts as the intermediary REST API layer. It handles business logic, strict input validation (using Zod), and secure file uploads.
- **Database (MySQL 8)**: The persistent relational storage layer. It maintains the hierarchical relationship between folders and documents. Foreign keys and indexes (like `parent_id`) ensure fast retrieval and consistent state during complex operations (e.g., recursive deletions via Transactions).

---

## 🐳 Docker Setup (Quick Start)

The easiest way to get the entire stack running is using Docker Compose. This automatically sets up the MySQL database, initializes the schema, and seeds the data.

```bash
docker-compose up --build
```

**Access Points:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v22 or later)
- [MySQL Server](https://www.mysql.com/) (v8.x)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

---

## ⚙️ Project Setup

### 1. Database Initialization

1. Log in to your MySQL instance:
   ```bash
   mysql -u root -p
   ```
2. Create the database:
   ```sql
   CREATE DATABASE vistra_dms;
   ```
3. Import the schema and seed data from the root directory:
   ```bash
   mysql -u root -p vistra_dms < database/schema.sql
   mysql -u root -p vistra_dms < database/seed.sql
   ```

### 2. Full-Stack Setup (Without Docker)

If running locally without Docker, follow these commands to setup both frontend and backend:

```bash
# Clone the repository and navigate to it (assuming already done)

# Setup Backend
cd backend
cp .env.example .env
npm install
npm run dev & # Runs on localhost:4000

# Setup Frontend (in a new terminal)
cd ../frontend
cp .env.example .env
npm install
npm run dev # Runs on localhost:3000
```

---

## 🏃 Running the Application

### Development Mode

Start both servers simultaneously in separate terminals:

**Backend:**
```bash
cd backend
npm run dev
```
*Server will be available at: `http://localhost:4000`*

**Frontend:**
```bash
cd frontend
npm run dev
```
*Application will be available at: `http://localhost:3000`*

---

## 🧪 Quality & Standards

We maintain high code standards using TypeScript and ESLint.

- **Check Types:** `npm run build` (runs `tsc --noEmit`)
- **Linting:** `npx eslint .` (available in both frontend and backend)

### Design Patterns
- **Controller-Service Pattern:** Decouples API logic from data access.
- **Standardized API Envelope:** Consistent response structure across all endpoints.
- **Schema-first Validation:** Request payloads are strictly validated using Zod.
- **Custom Hooks:** Business logic on the frontend is encapsulated in reusable TanStack Query hooks.

---

## 📘 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/folders` | List all root folders. |
| **GET** | `/api/v1/folders/:id/contents` | Get subfolders and documents for a specific folder. |
| **POST** | `/api/v1/folders` | Create a new folder. |
| **PUT** | `/api/v1/folders/:id` | Rename an existing folder. |
| **DELETE** | `/api/v1/folders/:id?mode=cascade\|move` | Delete a folder. Use `mode=cascade` to recursively delete all contents, or `mode=move` to move contents to the root directory. |
| **GET** | `/api/v1/documents` | Paginated list of documents with search and sort. |
| **POST** | `/api/v1/documents` | Record new document metadata. |
| **PUT** | `/api/v1/documents/:id` | Rename an existing document. |
| **POST** | `/api/v1/documents/upload` | Upload file to MinIO and create document record. |
| **DELETE** | `/api/v1/documents/:id` | Remove a document record. |

---
