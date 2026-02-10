import { test } from 'node:test';
import assert from 'node:assert';

function noop() {}

test('sendBulk: calls fetch with POST, JSON body, and correct headers', async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;
  const originalLog = console.log;
  const originalError = console.error;
  console.log = noop;
  console.error = noop;
  globalThis.fetch = async (url, opts) => {
    calls.push({ url, method: opts?.method, headers: opts?.headers, body: opts?.body });
    return { ok: true };
  };

  try {
    const { sendBulk } = await import('../src/mailer.js');
    const emailInfo = { to: 'test@example.com', payload: { code: 'ABC' } };
    await sendBulk(emailInfo, 0);
    assert.strictEqual(calls.length, 1);
    assert.strictEqual(calls[0].method, 'POST');
    assert.strictEqual(calls[0].body, JSON.stringify(emailInfo));
    assert.strictEqual(calls[0].headers['Content-Type'], 'application/json');
  } finally {
    globalThis.fetch = originalFetch;
    console.log = originalLog;
    console.error = originalError;
  }
});

test('sendBulk: throws when response is not ok', async () => {
  const originalFetch = globalThis.fetch;
  const originalError = console.error;
  console.error = noop;
  globalThis.fetch = async () => ({ ok: false, status: 500 });

  try {
    const { sendBulk } = await import('../src/mailer.js');
    await assert.rejects(
      async () => sendBulk({ to: 'a@b.com', payload: {} }, 0),
      /HTTP status 500/
    );
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalError;
  }
});
