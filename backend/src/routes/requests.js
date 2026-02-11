
const express = require('express');
const router = express.Router();
let requests = [
  { date: '2026-02-01', type: 'repair', detail: 'ไฟห้องน้ำดับ', status: 'รอดำเนินการ' },
  { date: '2026-01-20', type: 'other', detail: 'ขอเปลี่ยนห้อง', status: 'เสร็จสิ้น' }
];


// GET /api/requests
router.get('/', (req, res) => {
  res.json({ requests });
});


// POST /api/requests
router.post('/', (req, res) => {
  const { type, detail } = req.body;
  if (!type || !detail) {
    return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });
  }
  const newRequest = {
    date: new Date().toISOString().slice(0, 10),
    type,
    detail,
    status: 'รอดำเนินการ'
  };
  requests.unshift(newRequest);
  res.json({ success: true, request: newRequest });
});

module.exports = router;
