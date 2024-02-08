const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { sendBulk } = require('./mailer');
const { API_URL, EMAIL_TEMPLATE, MAILING_LIST } = require('./config');

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendEmails() {
  const emailsFilePath = path.resolve(MAILING_LIST);
  const emailData = JSON.parse(fs.readFileSync(emailsFilePath, 'utf8'));
  const errorLog = [];

  const bulkAnswer = await askQuestion(`Do you wish to send ${EMAIL_TEMPLATE} to ${emailData.length} emails? (Y / N) `);

  if (bulkAnswer.toLowerCase() === 'y') {
    console.log('📨 Sending emails...🚀');

    for (const emailInfo of emailData) {
      const result = await sendBulk(emailInfo);
      if (result.error) {
        errorLog.push(result);
      }
      await delay(5000);
    }

    if (errorLog.length > 0) {
      fs.writeFileSync('errorLog.json', JSON.stringify(errorLog, null, 2), 'utf8');
      console.log('Errors were logged to errorLog.json');
    }
  } else {
    console.log('⚠️ Aborting ⚠️');
  }
}

sendEmails();
