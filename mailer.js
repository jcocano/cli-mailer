const { API_URL, EMAIL_TEMPLATE } = require('./config');

async function sendBulk(emailInfo) {
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

    return { ...emailInfo, error: false, errorMessage: '' };
  } catch (error) {
    console.error(`Error for ${emailInfo.to}:`, error);
    return { ...emailInfo, error: true, errorMessage: error.message };
  }
}

module.exports = {
  sendBulk
};
