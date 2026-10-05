import test from "node:test";
import assert from "node:assert/strict";
import { createLoginUrl, readLoginCallback } from "../lib/catalog-auth.mjs";

test("login is scoped to the project and returns to this site's admin", () => {
  const url = new URL(
    createLoginUrl(
      "https://api.sanity.io/v1/auth/login/github",
      "https://example.com",
      "project",
      "random-state",
    ),
  );
  assert.equal(url.searchParams.get("projectId"), "project");
  assert.equal(url.searchParams.get("withSid"), "true");
  assert.equal(url.searchParams.get("type"), null);
  assert.equal(
    url.searchParams.get("origin"),
    "https://example.com/admin?loginState=random-state",
  );
  assert.throws(() =>
    createLoginUrl(
      "https://evil.example/login",
      "https://example.com",
      "project",
      "state",
    ),
  );
});

test("only a callback bound to this tab's sign-in attempt is accepted", () => {
  assert.equal(
    readLoginCallback(
      "https://example.com/admin?loginState=expected#sid=temporary",
      "expected",
    ),
    "temporary",
  );
  assert.equal(readLoginCallback("https://example.com/admin", null), null);
  assert.throws(() =>
    readLoginCallback(
      "https://example.com/admin?loginState=other#sid=temporary",
      "expected",
    ),
  );
  assert.throws(() =>
    readLoginCallback("https://example.com/admin#sid=temporary", null),
  );
  assert.equal(
    readLoginCallback("https://example.com/admin?sid=unexpected", null),
    null,
  );
});
