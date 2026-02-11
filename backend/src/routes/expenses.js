
const express = require('express');
const router = express.Router();
const expenses = [
  { date: '2026-02-05', title: 'ค่าทำความสะอาด', amount: 300, note: '' },
  { date: '2026-01-15', title: 'ค่าซ่อมแซมอุปกรณ์', amount: 1200, note: 'เปลี่ยนหลอดไฟ' },
  { date: '2025-12-20', title: 'ค่าบำรุงสวน', amount: 500, note: '' }
];


// GET /api/expenses
router.get('/', (req, res) => {
  res.json({ expenses });
});



module.exports = router;
