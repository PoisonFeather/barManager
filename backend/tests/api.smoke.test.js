import test from "node:test";
import assert from "node:assert/strict";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

test("GET /health/db returns healthy status", async () => {
  const response = await fetch(`${API_BASE_URL}/health/db`);
  assert.equal(response.status, 200);

  const payload = await response.json();
  assert.equal(payload.status, "ok");
  assert.equal(payload.database, "connected");
});

test("GET /menu-complete for missing slug returns 404", async () => {
  const response = await fetch(
    `${API_BASE_URL}/menu-complete/non-existent-slug-smoke-test`
  );
  assert.equal(response.status, 404);

  const payload = await response.json();
  assert.ok(payload.error);
});
