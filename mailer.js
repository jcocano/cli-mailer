const { API_URL, EMAIL_TEMPLATE } = require('./config');

function sendBulk(email) {
  const requestBody = JSON.stringify({ to: email });

  return fetch(API_URL + EMAIL_TEMPLATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: requestBody
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error in the request for ${email}`);
    }
    return response.text();
  })
  .then(data => {
    console.log(`Successful Request for ${email}:`, data);
  })
  .catch(error => {
    console.error(`Error for ${email}:`, error);
  });
}

module.exports = {
  sendBulk
};
