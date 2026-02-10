import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import assert from 'node:assert';
import { loadAndValidateMailingList } from '../src/lib/load-list.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const examplePath = path.join(projectRoot, 'examples', 'example.json');

test('loadAndValidateMailingList: returns array when file is valid', () => {
  const result = loadAndValidateMailingList(examplePath, 0);
  assert(Array.isArray(result));
  assert(result.length >= 1);
  assert.strictEqual(typeof result[0].to, 'string');
});

test('loadAndValidateMailingList: applies startAt slice', () => {
  const result = loadAndValidateMailingList(examplePath, 1);
  assert(Array.isArray(result));
  assert(result.length >= 0);
});

test('loadAndValidateMailingList: throws when file does not exist', () => {
  const badPath = path.join(projectRoot, 'does-not-exist-12345.json');
  assert.throws(
    () => loadAndValidateMailingList(badPath, 0),
    { message: `File not found: ${badPath}` }
  );
});

test('loadAndValidateMailingList: throws when JSON is invalid', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-mailer-test-'));
  const badJsonPath = path.join(tmpDir, 'bad.json');
  fs.writeFileSync(badJsonPath, 'not valid json {', 'utf8');
  try {
    assert.throws(
      () => loadAndValidateMailingList(badJsonPath, 0),
      { message: /Invalid JSON in/ }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('loadAndValidateMailingList: throws when root is not an array', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-mailer-test-'));
  const objPath = path.join(tmpDir, 'obj.json');
  fs.writeFileSync(objPath, '{"a":1}', 'utf8');
  try {
    assert.throws(
      () => loadAndValidateMailingList(objPath, 0),
      { message: 'MAILING_LIST must be a JSON array' }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('loadAndValidateMailingList: throws when item missing "to"', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-mailer-test-'));
  const noToPath = path.join(tmpDir, 'no-to.json');
  fs.writeFileSync(noToPath, '[{"payload":{}}]', 'utf8');
  try {
    assert.throws(
      () => loadAndValidateMailingList(noToPath, 0),
      { message: /Item at index 0 missing "to"/ }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});

test('loadAndValidateMailingList: throws when item has non-string "to"', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-mailer-test-'));
  const pathFile = path.join(tmpDir, 'to-number.json');
  fs.writeFileSync(pathFile, '[{"to":123}]', 'utf8');
  try {
    assert.throws(
      () => loadAndValidateMailingList(pathFile, 0),
      { message: /missing "to"/ }
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});
