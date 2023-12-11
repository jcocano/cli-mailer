const readline = require('readline');
const { sendBulk } = require('./mailer');

const { EMAIL_TEMPLATE, EMAILS, TEST_EMAILS } = require('./config');

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

async function sendTest() {
  const testAnswer = await askQuestion(
    `Do you want to send a test for ${EMAIL_TEMPLATE} to ${TEST_EMAILS.length} 
    email directions ? (Y / N) `);

  if (testAnswer.toLowerCase() === 'y') {
    console.log('📨 sending TEST emails...🚀');
    TEST_EMAILS.forEach(sendBulk);
  } else {
    await sendReal();
  }
}

async function sendReal() {
  const bulkAnswer = await askQuestion(
    `Do you wish to send ${EMAIL_TEMPLATE} to ${EMAILS.length} emails? 
    Please note: Once initiated, this operation cannot be cancelled. (Y / N) `);
  if (bulkAnswer.toLowerCase() === 'y') {
    console.log('📨 sending emails...🚀');
    EMAILS.forEach(sendBulk);
  } else {
    console.log('⚠️ \u0020aborting ⚠️');
  }
}

sendTest();
