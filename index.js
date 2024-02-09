const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { sendBulk } = require('./mailer');
const { EMAIL_TEMPLATE } = require('./config');

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

async function sendEmails() {
  const START_AT = parseInt(process.env.START_AT ?? '0', 10);
  const MAILING_LIST = process.env.MAILING_LIST;
  if (!MAILING_LIST) return console.log('⚠️ MAILING_LIST environment variable not found ⚠️');
  
  const emailsFilePath = path.resolve(MAILING_LIST);
  let emailData = JSON.parse(fs.readFileSync(emailsFilePath, 'utf8'));
  emailData = emailData.slice(START_AT);

  if(emailData.length === 0) return console.log('⚠️ No emails to send ⚠️');

  const bulkAnswer = await askQuestion(`Do you wish to send ${EMAIL_TEMPLATE} to ${emailData.length} emails? (Y / N) `);

  if (bulkAnswer.toLowerCase() === 'y') {
    console.log('📨 Sending emails...🚀');

    var idx = START_AT;
    for (const emailInfo of emailData) {
      const result = await sendBulk(emailInfo, idx++);
    }
  } else {
    console.log('⚠️ Aborting ⚠️');
  }
}

sendEmails();
