# Aptori RSVP

A full-stack event management and RSVP system built with Next.js and Express.js. This application allows users to create events, manage invitations, and handle RSVP responses.

## Note

**AI Usage Disclosure**: AI was only used to generate this README.md file. All other code, architecture, and implementation in this project was written manually without AI assistance.


## Features

- 🎉 **Event Management**: Create, read, update, and delete events
- 📝 **RSVP System**: Users can respond to event invitations (accept/decline)
- 🔐 **Authentication**: Secure authentication using Auth0
- 💾 **Database**: PostgreSQL database with Prisma ORM
- ⚡ **Caching**: Redis integration for improved performance
- 🎨 **Modern UI**: Material-UI components with responsive design
- 📊 **Data Grid**: Interactive data tables for viewing events and invitations

## Current Status

### Completed
- ✅ Backend API structure with Express.js and TypeScript
- ✅ Database schema with Prisma ORM (Events and RSVPs models)
- ✅ Authentication middleware using Auth0
- ✅ Redis integration for caching
- ✅ Request/response validation with Zod
- ✅ Error handling and logging infrastructure
- ✅ Basic frontend structure with Next.js and Material-UI
- ✅ Form components with Formik and Yup validation

### Remaining Work
- ⏳ **Authentication**: Currently using Auth0 for authentication. We can create our own authentication system with JWT tokens for more control and customization.
- ⏳ **List Table UI**: The events and invitations list UI components need to be fully implemented with API integration.
- ⏳ **Form UI**: The create event form UI needs to be completed with proper styling and user experience.
- ⏳ **API Integration**: Frontend components need to be connected to the backend API endpoints.
- ⏳ **User Autocomplete API**: Create an API endpoint to fetch user list based on autocomplete field in the create event form. This will allow event creators to search and select users when creating events.

## Tech Stack

### Backend (API)
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: Auth0 (OAuth2 JWT Bearer)
- **Validation**: Zod
- **Logging**: Winston with daily rotate file
- **Security**: Helmet, CORS

### Frontend (App)
- **Framework**: Next.js 16.x
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Forms**: Formik with Yup validation
- **Authentication**: Auth0 React SDK
- **Data Grid**: MUI X Data Grid

## Project Structure

```
aptori-rsvp/
├── api/                    # Backend Express.js API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Express middlewares (auth, etc.)
│   │   ├── parsers/        # Request/response validation schemas
│   │   ├── errors/         # Error handling
│   │   ├── lib/            # Database and Redis clients
│   │   ├── utils/          # Utility functions
│   │   └── app.ts          # Express app entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── Dockerfile          # Docker configuration
│   └── package.json
│
└── app/                    # Frontend Next.js application
    ├── src/
    │   ├── components/     # React components
    │   ├── layouts/        # Layout components
    │   ├── pages/          # Next.js pages
    │   ├── styles/         # Global styles
    │   └── utils/          # Utility functions
    └── package.json
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **PostgreSQL** database
- **Redis** server
- **Auth0** account (for authentication)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aptori-rsvp
   ```

2. **Install backend dependencies**
   ```bash
   cd api
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../app
   npm install
   ```

## Environment Variables

### Backend (API)

Create a `.env` file in the `api/` directory with the following variables:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aptori_rsvp?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Auth0
AUTH0_ISSUER_BASE_URL="https://your-tenant.auth0.com"
AUTH0_AUDIENCE="your-api-audience"
```

### Frontend (App)

Create a `.env.local` file in the `app/` directory:

```env
# Auth0
NEXT_PUBLIC_AUTH0_DOMAIN="your-tenant.auth0.com"
NEXT_PUBLIC_AUTH0_CLIENT_ID="your-client-id"
NEXT_PUBLIC_AUTH0_AUDIENCE="your-api-audience"

# API
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Database Setup

1. **Generate Prisma Client**
   ```bash
   cd api
   npm run prisma:generate
   ```

2. **Run database migrations**
   ```bash
   npm run migrate
   ```

3. **Seed the database (optional)**
   ```bash
   npm run prisma:seed
   ```

## Running the Application

### Development Mode

1. **Start the backend API**
   ```bash
   cd api
   npm run dev
   ```
   The API will run on `http://localhost:3000` (or the port specified in your `.env`)

2. **Start the frontend app** (in a new terminal)
   ```bash
   cd app
   npm run dev
   ```
   The app will run on `http://localhost:3001` (Next.js default port)

### Production Mode

1. **Build the backend**
   ```bash
   cd api
   npm run build
   npm start
   ```

2. **Build the frontend**
   ```bash
   cd app
   npm run build
   npm start
   ```

## API Endpoints

### Events

- `GET /events` - List all events for the authenticated user
- `GET /events/:id` - Get a specific event by ID
- `POST /events` - Create a new event
- `PATCH /events/:id` - Update an event
- `DELETE /events/:id` - Delete an event
- `PATCH /events/:id/rsvp/:response` - Update RSVP response for an event

All endpoints require authentication via Auth0 JWT Bearer token.

## Database Schema

### Events
- `id` (UUID) - Primary key
- `name` (String) - Event name
- `description` (String, optional) - Event description
- `location` (String) - Event location
- `time` (DateTime) - Event date and time
- `userId` (String) - Creator's user ID
- `createdAt`, `updatedAt`, `deletedAt` - Timestamps

### RSVPs
- `id` (UUID) - Primary key
- `eventId` (UUID) - Foreign key to Events
- `userId` (String) - User's ID
- `response` (String, optional) - RSVP response
- `createdAt`, `updatedAt`, `deletedAt` - Timestamps

## Docker

The backend includes a Dockerfile for containerized deployment:

```bash
cd api
docker build -t aptori-rsvp-api .
docker run -p 8000:8000 aptori-rsvp-api
```

The frontend includes a Dockerfile for containerized deployment:

```bash
cd app
docker build -t aptori-rsvp-app .
docker run -p 3000:3000 aptori-rsvp-app
```

## Development Scripts

### Backend (API)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run prettier` - Check code formatting
- `npm run prettier:fix` - Fix code formatting
- `npm run migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma Client

### Frontend (App)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Security

### Backend Security

The backend implements multiple layers of security to protect against common vulnerabilities:

- **Helmet.js**: Sets various HTTP headers to secure Express apps by default, protecting against XSS, clickjacking, and other attacks
- **API Rate Limiting**: Prevents abuse and DDoS attacks by limiting the number of requests from a single IP address
- **Prisma ORM**: Provides SQL injection prevention through parameterized queries and type-safe database access
- **CORS**: Configured to restrict cross-origin requests to trusted domains only
- **Zod Validation**: Comprehensive request and response validation and parsing to ensure data integrity and prevent malformed data attacks
- **Auth0 JWT Bearer**: Secure token-based authentication with OAuth2 JWT Bearer tokens

### Frontend Security

The frontend implements security best practices for web applications:

- **Next.js Secure Headers**: Configured secure headers including Content Security Policy (CSP), XSS Protection, and other security headers
- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling which resources can be loaded
- **XSS Protection**: Built-in XSS protection headers to prevent cross-site scripting attacks
- **Secure Headers**: Additional security headers for website security including HSTS, frame options, and referrer policy
- **Form Validation**: Yup and Formik for comprehensive form validations with proper error messages to prevent invalid data submission
- **Auth0 React SDK**: Secure client-side authentication handling

## Can Improve Further

The following improvements can be made to enhance the project:

- **API Documentation**: Create comprehensive API documentation using Zod + OpenAPI + Swagger for better developer experience and API discoverability
- **Redis Cluster Implementation**: Migrate from the current Redis client to ioredis for better Redis cluster support, especially for GCP Redis clusters
- **Testing**: Add unit and integration tests for both backend and frontend to ensure code quality and prevent regressions
- **Frontend Linting**: Implement proper linting configuration on the frontend to maintain code consistency and catch potential errors
- **CI/CD Pipeline**: Add continuous integration and continuous deployment pipeline for automated linting and test running on every commit
- **Development Server**: The backend already uses nodemon for dev server watching, ensuring automatic restarts on file changes
