// GoogleSheetsService.js
// Service สำหรับเชื่อมต่อ Google Sheets API ด้วย Service Account
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = path.join(process.cwd(), 'backend', 'google-service-account.json');

function getAuth() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
  const { client_email, private_key } = credentials;
  return new google.auth.JWT(
    client_email,
    null,
    private_key,
    SCOPES
  );
}

export async function getSheet(spreadsheetId, range) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });
  return res.data.values;
}

export async function appendSheet(spreadsheetId, range, values) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  });
  return res.data;
}

export async function updateSheet(spreadsheetId, range, values) {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  });
  return res.data;
}
