const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../app")();

test("GET /health returns a service health response", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.status, "ok");
});

test("POST /api/auth/register rejects incomplete input", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({ email: "engineer@example.com" });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
});

test("unknown routes return a consistent 404 response", async () => {
  const response = await request(app).get("/api/does-not-exist");

  assert.equal(response.status, 404);
  assert.deepEqual(response.body, {
    success: false,
    message: "Route not found",
  });
});
