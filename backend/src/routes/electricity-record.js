// backend/src/routes/electricity-record.js
// SPEC: GET ตารางค่าไฟบ้านพักครู/แฟลต, POST บันทึกค่าไฟล่าสุด, lost, ยอดรวม, ปัดเศษขึ้น, คำนวณส่วนต่าง
const express = require('express');
const router = express.Router();

// Mock config (admin will set later)
const ELECTRIC_RATE = 5; // บาทต่อหน่วย
const EMPTY_UNIT_FEE = 9; // ค่าอ่านมิเตอร์

let units = [
  { unitId: 'H001', name: 'สมชาย ใจดี', latestValue: null, type: 'house', occupied: true },
  { unitId: 'H002', name: 'สมหญิง สุขใจ', latestValue: null, type: 'house', occupied: false },
  { unitId: 'F101', name: 'วราภรณ์ แฟลต', latestValue: null, type: 'flat', occupied: true }
];

let summary = { totalElectric: null, lostHouse: null, lostFlat: null, diff: null };

function calcAmount(unit) {
  if (!unit.occupied) return EMPTY_UNIT_FEE;
  if (unit.latestValue === null) return 0;
  return Math.ceil(unit.latestValue * ELECTRIC_RATE);
}

// GET /api/electricity-record
router.get('/', (req, res) => {
  const houses = units.filter(u => u.type === 'house').map(u => ({ ...u, amount: calcAmount(u) }));
  const flats = units.filter(u => u.type === 'flat').map(u => ({ ...u, amount: calcAmount(u) }));
  // คำนวณ diff
  const totalCollected = [...houses, ...flats].reduce((sum, u) => sum + (u.amount || 0), 0);
  let diff = null;
  if (summary.totalElectric !== null) {
    diff = summary.totalElectric - totalCollected;
  }
  res.json({ houses, flats, ...summary, diff });
});

// POST /api/electricity-record/save
router.post('/save', (req, res) => {
  const { unitId, latestValue } = req.body;
  const unit = units.find(u => u.unitId === unitId);
  if (!unit || typeof latestValue !== 'number' || latestValue < 0) {
    return res.status(400).json({ success: false });
  }
  unit.latestValue = Math.ceil(latestValue);
  res.json({ success: true });
});

// POST /api/electricity-record/summary
router.post('/summary', (req, res) => {
  const { totalElectric, lostHouse, lostFlat } = req.body;
  summary.totalElectric = totalElectric;
  summary.lostHouse = lostHouse;
  summary.lostFlat = lostFlat;
  res.json({ success: true });
});

module.exports = router;
