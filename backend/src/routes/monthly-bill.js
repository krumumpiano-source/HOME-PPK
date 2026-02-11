// backend/src/routes/monthly-bill.js
// SPEC: GET ตารางแจ้งยอดชำระ, mock export/send/remind
import { Router } from 'express';
const router = Router();

// Mock config
const CENTRAL_AMOUNT = 110;

// Mock in-memory data
let bills = [
  { unitId: 'H001', name: 'สมชาย ใจดี', prevWater: 1200, latestWater: 1250, waterAmount: 400, electricAmount: 600, centralAmount: CENTRAL_AMOUNT, totalAmount: 1110, status: 'pending' },
  { unitId: 'H002', name: 'สมหญิง สุขใจ', prevWater: 980, latestWater: 1000, waterAmount: 160, electricAmount: 300, centralAmount: CENTRAL_AMOUNT, totalAmount: 570, status: 'overdue' },
  { unitId: 'F101', name: 'วราภรณ์ แฟลต', prevWater: 300, latestWater: 320, waterAmount: 160, electricAmount: 200, centralAmount: CENTRAL_AMOUNT, totalAmount: 470, status: 'paid' }
];

// GET /api/monthly-bill
router.get('/', (req, res) => {
  res.json({ bills });
});

// Mock endpoints for export/send/remind
router.post('/export-img', (req, res) => {
  res.json({ success: true });
});
router.post('/export-sheet', (req, res) => {
  res.json({ success: true });
});
router.post('/send-email', (req, res) => {
  res.json({ success: true });
});
router.post('/remind', (req, res) => {
  res.json({ success: true });
});

export default router;
