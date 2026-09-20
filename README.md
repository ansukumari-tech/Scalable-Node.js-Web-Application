# Scalable Node.js Web Application

A production-minded user registration service built with Node.js, Express, MongoDB, and a small browser client. The project demonstrates API design, secure password handling, operational readiness, automated tests, and clean separation between the HTTP app and the server process.

## Features

- User registration with normalized email addresses
- Password hashing with `bcryptjs` (passwords are never returned by the API)
- Mongoose schema validation and duplicate-email protection
- Helmet security headers, configurable CORS, request body limits, and authentication rate limiting
- Consistent JSON responses for validation, 404, and server errors
- `GET /health` readiness endpoint
- Graceful shutdown on `SIGINT` and `SIGTERM`
- Testable Express app factory and Node.js test runner coverage
- Simple responsive registration UI served from `public/`

## Tech stack

- Node.js 18+
- Express 5
- MongoDB with Mongoose
- HTML, CSS, and browser JavaScript
- Node.js built-in test runner and Supertest

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Copy `.env.example` to `.env` and update `MONGO_URI` if needed:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/nodejs-webapp
PORT=3000
NODE_ENV=development
```

### 3. Start MongoDB

Run a local MongoDB instance or use a hosted MongoDB connection string.

### 4. Run the application

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). The API is available at `POST /api/auth/register`, and service health is available at `GET /health`.

For development with automatic restarts:

```bash
npm run dev
```

## API example

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Ada Lovelace\",\"email\":\"ada@example.com\",\"password\":\"securepass123\"}"
```

Successful registrations return `201 Created`. Invalid input returns `400`, and duplicate email addresses return `409 Conflict`.

## Testing

Tests do not require MongoDB for health, routing, or request validation:

```bash
npm test
```

## Project structure

```text
app.js                 Express application factory
server.js              Database connection and process lifecycle
config/db.js           MongoDB connection configuration
controllers/           Request handlers
middleware/            Shared error handling
models/                Mongoose schemas
routes/                API route definitions
public/                Browser client
test/                  Automated API tests
```
