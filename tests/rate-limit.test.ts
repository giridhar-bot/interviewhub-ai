import assert from "node:assert/strict";
import { test } from "node:test";

delete process.env.REDIS_URL;
const limiter = import("../src/lib/rate-limit");

test("enforces the limit when Redis is disabled", async () => {
  const { rateLimit } = await limiter;
  const key = `test:${crypto.randomUUID()}`;
  const first = await rateLimit(key, 2, 60);
  const second = await rateLimit(key, 2, 60);
  const third = await rateLimit(key, 2, 60);
  assert.equal(first.success, true);
  assert.equal(first.remaining, 1);
  assert.equal(second.success, true);
  assert.equal(second.remaining, 0);
  assert.equal(third.success, false);
  assert.equal(third.remaining, 0);
  assert.equal(third.resetAt.getTime(), first.resetAt.getTime());
});

test("isolates rate limits by key", async () => {
  const { rateLimit } = await limiter;
  const key = `test:${crypto.randomUUID()}`;
  await rateLimit(key, 1, 60);
  assert.equal((await rateLimit(key, 1, 60)).success, false);
  assert.equal((await rateLimit(`${key}:other`, 1, 60)).success, true);
});
