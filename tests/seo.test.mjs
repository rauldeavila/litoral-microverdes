import test from "node:test";
import assert from "node:assert/strict";
import config from "../next.config.js";

test("production stays indexable while every admin route is noindex", async () => {
  const previous = process.env.VERCEL_ENV;
  try {
    for (const environment of ["production", undefined]) {
      if (environment) process.env.VERCEL_ENV = environment;
      else delete process.env.VERCEL_ENV;
      const rules = await config.headers();
      assert.deepEqual(rules, [
        {
          source: "/admin/:path*",
          headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
        },
      ]);
    }
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});

test("Vercel previews are excluded from search on all routes", async () => {
  const previous = process.env.VERCEL_ENV;
  try {
    process.env.VERCEL_ENV = "preview";
    const rules = await config.headers();
    assert.equal(rules[0].source, "/:path*");
    assert.equal(rules[0].headers[0].value, "noindex, nofollow");
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});
