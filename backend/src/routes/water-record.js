// backend/src/routes/water-record.js
// SPEC: GET ตารางค่าน้ำบ้านพักครู/แฟลต, POST บันทึกเลขมิเตอร์ล่าสุด, คำนวณยอดเงินอัตโนมัติ
const express = require('express');
const router = express.Router();

// Mock config (admin will set later)
const WATER_RATE = 8; // บาทต่อหน่วย

// Mock in-memory data
let units = [
  { unitId: 'H001', name: 'สมชาย ใจดี', prevMeter: 1200, latestMeter: null, type: 'house' },
  { unitId: 'H002', name: 'สมหญิง สุขใจ', prevMeter: 980, latestMeter: null, type: 'house' },
  { unitId: 'F101', name: 'วราภรณ์ แฟลต', prevMeter: 300, latestMeter: null, type: 'flat' }
];

function calcAmount(prev, latest) {
  if (latest === null || latest <= prev) return 0;
  return (latest - prev) * WATER_RATE;
}

// GET /api/water-record
router.get('/', (req, res) => {
  const houses = units.filter(u => u.type === 'house').map(u => ({ ...u, amount: calcAmount(u.prevMeter, u.latestMeter) }));
  const flats = units.filter(u => u.type === 'flat').map(u => ({ ...u, amount: calcAmount(u.prevMeter, u.latestMeter) }));
  res.json({ houses, flats });
});

// POST /api/water-record/save
router.post('/save', (req, res) => {
  const { unitId, latestMeter } = req.body;
  const unit = units.find(u => u.unitId === unitId);
  if (!unit || typeof latestMeter !== 'number' || latestMeter < unit.prevMeter) {
    return res.status(400).json({ success: false });
  }
  unit.latestMeter = latestMeter;
  res.json({ success: true });
});

module.exports = router;
