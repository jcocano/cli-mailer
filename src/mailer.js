import { API_URL, EMAIL_TEMPLATE, AUTHORIZATION } from './config.js';

function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (AUTHORIZATION) headers['Authorization'] = AUTHORIZATION;
  return headers;
}

export async function sendBulk(emailInfo, idx) {
  const requestBody = JSON.stringify(emailInfo);

  try {
    const response = await fetch(API_URL + EMAIL_TEMPLATE, {
      method: 'POST',
      headers: buildHeaders(),
      body: requestBody
    });

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    console.log(emailInfo.to);
  } catch (error) {
    console.error(`failed at ${idx}`, error);
    throw error;
  }
}
