import { Router } from 'express';
import { getSheet, appendSheet } from '../GoogleSheetsService.js';

const router = Router();

// Spreadsheet ID และ range สำหรับ BILLS
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_BILLS_ID;
const RANGE = 'BILLS!A2:J'; // ข้าม header row

/**
 * GET /api/bills
 * Get all bills (from Google Sheets)
 */
router.get('/', async (req, res) => {
  try {
    const rows = await getSheet(SPREADSHEET_ID, RANGE);
    const bills = (rows || []).map(row => ({
      id: row[0],
      user_id: row[1],
      period: row[2],
      water_amount: row[3],
      electricity_amount: row[4],
      total_amount: row[5],
      due_date: row[6],
      status: row[7],
      created_at: row[8],
      updated_at: row[9]
    }));
    res.json({ success: true, data: bills, total: bills.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/bills
 * Create new bill (append to Google Sheets)
 */
router.post('/', async (req, res) => {
  try {
    const { user_id, period, water_amount, electricity_amount, total_amount, due_date, status } = req.body;
    const now = new Date().toISOString();
    const id = Date.now().toString();
    const values = [[id, user_id, period, water_amount, electricity_amount, total_amount, due_date, status || 'pending', now, now]];
    await appendSheet(SPREADSHEET_ID, 'BILLS!A2:J', values);
    res.status(201).json({ success: true, data: { id, user_id, period, water_amount, electricity_amount, total_amount, due_date, status: status || 'pending', created_at: now, updated_at: now } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
