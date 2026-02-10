import fs from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';

const cwd = process.cwd();
const envPath = path.join(cwd, '.env');
const envExamplePath = path.join(cwd, '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('Created .env — edit it with your API_URL, EMAIL_TEMPLATE and MAILING_LIST, then run again.');
  process.exit(0);
}

if (fs.existsSync(envPath)) {
  loadEnvFile(envPath);
}

export const API_URL = process.env.API_URL || '';
export const EMAIL_TEMPLATE = process.env.EMAIL_TEMPLATE || '';

const API_KEY = process.env.API_KEY || '';
const AUTH_HEADER = process.env.AUTH_HEADER || '';
export const AUTHORIZATION = AUTH_HEADER || (API_KEY ? `Bearer ${API_KEY}` : '');
