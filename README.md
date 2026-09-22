<div align="center">

# Scalable Node.js Web Application

### A secure, production-minded user registration service built with Express and MongoDB

<p>
  <img src="https://img.shields.io/badge/Node.js-20.19%2B-339933?logo=node.js&logoColor=white" alt="Node.js 20.19+">
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5">
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB with Mongoose">
  <img src="https://img.shields.io/badge/Tests-Node.js%20%7C%20Supertest-1f6feb" alt="Node.js and Supertest">
</p>

<p>
  <a href="#-quick-start">Quick start</a> ·
  <a href="#-api-reference">API reference</a> ·
  <a href="#-project-architecture">Architecture</a> ·
  <a href="#-testing">Testing</a>
</p>

</div>

---

## Overview

This project is a full-stack Node.js application that demonstrates how to move beyond a demo API toward a maintainable software-engineering project. It combines a responsive browser registration form with a REST API, MongoDB persistence, secure password hashing, defensive request handling, automated tests, and operational health checks.

The codebase is intentionally small enough to understand quickly while following patterns that scale to larger services:

- HTTP application creation is separated from process and database startup.
- Controllers, routes, models, and middleware have clear responsibilities.
- Passwords are hashed before persistence and excluded from API responses.
- Errors and validation failures use predictable JSON responses.

## ✨ Features

- **User registration API** with normalized email addresses
- **Secure password storage** using `bcryptjs`
- **Mongoose validation** for names, emails, and required fields
- **Duplicate-email protection** with `409 Conflict` responses
- **Security hardening** with Helmet, CORS configuration, and request-size limits
- **Authentication rate limiting** on `/api/auth`
- **Health endpoint** for local checks and deployment probes
- **Graceful shutdown** on `SIGINT` and `SIGTERM`
- **Responsive registration UI** served directly by Express
- **Consistent error responses** for invalid JSON, missing routes, and server errors
- **Automated API tests** using the Node.js test runner and Supertest

## 🧰 Tech stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js 20.19+ |
| Web framework | Express 5 |
| Database | MongoDB |
| ODM | Mongoose |
| Password security | bcryptjs |
| HTTP security | Helmet, CORS, express-rate-limit |
| Logging | Morgan |
| Testing | Node.js built-in test runner, Supertest |
| Frontend | HTML, CSS, browser JavaScript |

## 🚀 Quick start

### Prerequisites

- Node.js 20.19.0 or newer
- npm
- MongoDB running locally or a MongoDB connection string

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

Recommended local configuration:

```env
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/nodejs-webapp
CORS_ORIGIN=
```

> Keep `.env` private. It is ignored by Git; commit `.env.example` instead.

### 3. Start MongoDB

Start your local MongoDB service, or use MongoDB Compass to confirm that `localhost:27017` is available.

### 4. Start the application

For normal execution:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

Open the application at **[http://localhost:3000](http://localhost:3000)**.

Once a user is registered, view the saved document in MongoDB Compass:

```text
localhost:27017 → nodejs-webapp → users
```

## 🔌 API reference

### Health check

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "status": "ok",
  "timestamp": "2026-09-20T15:32:02.702Z"
}
```

### Register a user

```http
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "securepass123"
}
```

PowerShell:

```powershell
$body = @{
  name = "Ada Lovelace"
  email = "ada@example.com"
  password = "securepass123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Success response: `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64f...",
      "name": "Ada Lovelace",
      "email": "ada@example.com",
      "createdAt": "2026-09-20T15:32:02.702Z",
      "updatedAt": "2026-09-20T15:32:02.702Z"
    }
  }
}
```

The password is never returned in the response. It is stored as a bcrypt hash in MongoDB.

| Status | Meaning |
| --- | --- |
| `201` | User created |
| `400` | Missing or invalid input |
| `409` | Email address already exists |
| `429` | Authentication rate limit exceeded |
| `500` | Unexpected server error |

## 🏗️ Project architecture

```text
┌──────────────────┐      POST /api/auth/register      ┌──────────────────┐
│ Browser client   │ ────────────────────────────────▶ │ Express API      │
│ public/index.html│                                  │ routes/controllers│
└──────────────────┘                                  └────────┬─────────┘
                                                               │
                                                               ▼
                                                        ┌───────────────┐
                                                        │ User model    │
                                                        │ validation +  │
                                                        │ bcrypt hash   │
                                                        └──────┬────────┘
                                                               │
                                                               ▼
                                                        ┌───────────────┐
                                                        │ MongoDB       │
                                                        │ nodejs-webapp │
                                                        └───────────────┘
```

```text
app.js                 Express app factory and middleware
server.js              MongoDB startup and server lifecycle
config/db.js           MongoDB connection configuration
controllers/           Request handlers and application logic
middleware/            Shared error handling
models/                Mongoose schemas and serialization rules
routes/                API route definitions
public/                Browser registration client
test/                  Automated API tests
```

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The tests cover app creation, health and routing behavior, request validation, and API responses without requiring MongoDB for every test.

## 🔐 Security notes

- Passwords are hashed with bcrypt before they are written to MongoDB.
- The password field is excluded from normal Mongoose queries and JSON serialization.
- Do not commit `.env` or production secrets.
- Use a managed MongoDB deployment and a restricted database user in production.
- Set an explicit `CORS_ORIGIN` when the frontend is hosted on another domain.
- Put the application behind HTTPS in production.
- Add authentication, authorization, and account recovery before exposing protected features.

## 🛠️ Troubleshooting

### The browser shows a directory listing

Make sure the Node.js server is running and open:

```text
http://localhost:3000
```

Do not open the project folder through a static file server.

### MongoDB Compass shows no users

The application uses the database configured by `MONGO_URI`. With the default configuration, check:

```text
localhost:27017 → nodejs-webapp → users → Documents
```

Click the refresh icon after submitting the form. Keep the terminal running and confirm it shows:

```text
MongoDB connected successfully
Server running on port 3000
```

### Port 3000 is already in use

Find the process using the port:

```powershell
Get-NetTCPConnection -LocalPort 3000
```

Alternatively, change `PORT` in `.env` and open the matching URL.

## 📌 Future improvements

- Login and JWT-based authentication
- Refresh-token rotation and logout
- Email verification and password reset
- Role-based authorization
- OpenAPI/Swagger documentation
- Structured logging and request IDs
- Docker and CI/CD configuration

## 📄 License

This project is available under the ISC license specified in `package.json`.
