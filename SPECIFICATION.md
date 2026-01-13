# APP-CREATOR Specification

## 1. Product Requirements Document (PRD)

### Overview
APP-CREATOR is an AI-powered full-stack application builder that allows users to describe an application via a wizard or chat interface and generates a production-ready codebase (frontend, backend, database).

### User Roles
- **Guest**: Access to landing page, demo "preview" generation (limited).
- **User**: Registered user. Can create projects, save history, download source code.
- **Admin**: System management (templates, usage limits).

### Core Features (MVP)
1.  **Project Wizard**: Multi-step form to collect app requirements (Name, Type, Features, Data Model).
2.  **Code Generation Engine**: A backend service that takes the JSON specification from the wizard and produces a file structure.
    -   *MVP Target*: Generate a Next.js "Hello World" app based on user inputs.
3.  **Download**: Ability to download the generated code as a ZIP file.
4.  **Dashboard**: View list of created projects and their status.
5.  **Authentication**: Basic email/password or mock auth for MVP.

## 2. Technical Architecture

### Stack
-   **Monorepo**: Turborepo
-   **Frontend (`apps/web`)**: Next.js 14 (App Router), TailwindCSS, TypeScript, Shadcn/UI (components).
-   **Backend (`apps/api`)**: NestJS, TypeScript.
-   **Database**: PostgreSQL.
-   **ORM**: Prisma.
-   **Queue**: BullMQ + Redis (for handling generation jobs asynchronously).
-   **Deployment**: Docker Compose for local dev (DB + Redis).

### Data Flow
1.  User completes Wizard on `web`.
2.  `web` sends a `POST /projects` payload to `api`.
3.  `api` saves project metadata to Postgres.
4.  `api` adds a job to the `generation-queue`.
5.  `worker` picks up the job, constructs the file tree in memory/temp storage based on the selected Template.
6.  `worker` zips the result and uploads/saves the path.
7.  `web` polls or receives websocket update (MVP: polling) for status.
8.  User clicks "Download".

## 3. Database Schema (Prisma)

```prisma
// apps/api/prisma/schema.prisma

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String?
  role      String    @default("USER") // USER, ADMIN
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Project {
  id          String   @id @default(uuid())
  name        String
  description String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  status      String   @default("DRAFT") // DRAFT, GENERATING, COMPLETED, FAILED
  config      Json     // Stores the wizard answers (features, data model spec)
  zipPath     String?  // Path to the generated zip file
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Template {
  id          String   @id @default(uuid())
  name        String
  key         String   @unique // e.g., "saas-starter"
  structure   Json     // Defines the base file structure or path to template files
}
```

## 4. API Specification (NestJS)

### Auth
-   `POST /auth/login`
-   `POST /auth/register`

### Projects
-   `GET /projects`: List user projects.
-   `GET /projects/:id`: Get details + status.
-   `POST /projects`: Create a new project definition.
    -   Body: `{ name: "MyApp", config: { ... } }`
-   `POST /projects/:id/generate`: Trigger generation manually (if not auto-triggered).
-   `GET /projects/:id/download`: Stream the ZIP file.

## 5. Folder Structure (Monorepo)

```text
.
├── apps
│   ├── web (Next.js)
│   └── api (NestJS)
├── packages
│   ├── ui (Shared UI components - optional)
│   ├── config (Shared ESLint/TSConfig)
│   └── shared-types (DTOs shared between generic BE/FE)
├── docker-compose.yml (Postgres, Redis)
└── package.json
```
