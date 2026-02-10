import readline from 'node:readline';
import path from 'node:path';
import { loadAndValidateMailingList } from './lib/load-list.js';
import { sendBulk } from './mailer.js';
import { API_URL, EMAIL_TEMPLATE } from './config.js';

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
  if (!API_URL || !EMAIL_TEMPLATE) {
    console.log('Set API_URL and EMAIL_TEMPLATE in .env');
    process.exit(1);
  }

  const START_AT = parseInt(process.env.START_AT ?? '0', 10);
  const DRY_RUN = String(process.env.DRY_RUN ?? '').toLowerCase() === 'true';
  const DELAY_MS = parseInt(process.env.DELAY_MS ?? '0', 10) || 0;
  const MAILING_LIST = process.env.MAILING_LIST;

  if (!MAILING_LIST) {
    console.log('Set MAILING_LIST in .env (path to your JSON list, e.g. ./examples/example.json)');
    process.exit(1);
  }

  let emailData;
  try {
    emailData = loadAndValidateMailingList(path.resolve(MAILING_LIST), START_AT);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }

  if (emailData.length === 0) return console.log('⚠️ No emails to send ⚠️');

  if (DRY_RUN) {
    console.log(`🧪 DRY RUN enabled — no emails will be sent. Showing what would be sent...`);
  }

  const bulkAnswer = await askQuestion(`Send ${EMAIL_TEMPLATE} to ${emailData.length} emails? (Y / N) `);

  if (bulkAnswer.toLowerCase() !== 'y') {
    return console.log('⚠️ Aborting ⚠️');
  }

  console.log(DRY_RUN ? '📄 Listing emails that would be sent...' : '📨 Sending...');

  let idx = START_AT;
  for (const emailInfo of emailData) {
    try {
      if (DRY_RUN) {
        console.log(`[DRY RUN] to=${emailInfo.to} idx=${idx}`);
      } else {
        await sendBulk(emailInfo, idx);
        console.log(emailInfo.to);
      }
    } catch (err) {
      console.error(`failed at ${idx}`, err);
    }

    idx++;

    if (!DRY_RUN && DELAY_MS > 0) {
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
}

sendEmails();
