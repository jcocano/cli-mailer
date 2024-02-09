const { API_URL, EMAIL_TEMPLATE } = require('./config');

async function sendBulk(emailInfo, idx) {
  const requestBody = JSON.stringify(emailInfo);

  try {
    const response = await fetch(API_URL + EMAIL_TEMPLATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
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

module.exports = {
  sendBulk
};
