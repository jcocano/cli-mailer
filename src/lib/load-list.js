import fs from 'node:fs';

/**
 * Loads and validates the mailing list JSON file.
 * @param {string} filePath - Absolute path to the JSON file
 * @param {number} startAt - Index to start slicing from
 * @returns {Array<{ to: string, payload?: object }>}
 * @throws {Error} When file is missing, invalid JSON, not an array, or an item lacks "to"
 */
export function loadAndValidateMailingList(filePath, startAt = 0) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    throw new Error(`Invalid JSON in ${filePath}: ${err.message}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('MAILING_LIST must be a JSON array');
  }

  const list = data.slice(startAt);
  const badIndex = list.findIndex((item) => !item || typeof item.to !== 'string');
  if (badIndex !== -1) {
    throw new Error(`Item at index ${startAt + badIndex} missing "to"`);
  }

  return list;
}
