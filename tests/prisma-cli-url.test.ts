import assert from "node:assert/strict";
import { test } from "node:test";
import { getPrismaCliUrl } from "../src/config/database";

test("uses the direct Neon endpoint for CLI operations without changing credentials or TLS settings", () => {
  const pooled =
    "postgresql://owner:example-password@ep-test-pooler.c-3.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const cliUrl = getPrismaCliUrl(pooled);
  assert.ok(cliUrl);
  const result = new URL(cliUrl);
  const original = new URL(pooled);
  assert.equal(result.hostname, "ep-test.c-3.aws.neon.tech");
  assert.equal(result.username, original.username);
  assert.equal(result.password, original.password);
  assert.equal(result.search, original.search);
  assert.equal(result.pathname, original.pathname);
});

test("honors an explicit direct connection and does not rewrite non-Neon hosts", () => {
  const direct = "postgresql://owner:example-password@direct.example.test/db";
  assert.equal(getPrismaCliUrl("postgresql://pool.example.test/db", direct), direct);
  const other = "postgresql://owner:example-password@db-pooler.example.test/db";
  assert.equal(getPrismaCliUrl(other), other);
});

test("rejects invalid CLI URLs without including secret input in the error", () => {
  assert.throws(
    () => getPrismaCliUrl("invalid-private-value"),
    (error: unknown) => error instanceof Error && !error.message.includes("invalid-private-value")
  );
  assert.throws(() => getPrismaCliUrl("https://example.test/database"), /PostgreSQL/);
});
