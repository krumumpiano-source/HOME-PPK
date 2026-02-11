// backend/src/routes/profile.js
// SPEC: GET/POST ข้อมูลส่วนตัว, ผู้ร่วมพักอาศัย, mock ข้อมูล
const express = require('express');
const router = express.Router();

let profile = {
  prefix: 'นาย',
  firstname: 'สมชาย',
  lastname: 'ใจดี',
  address: '123 หมู่ 1 ต.บ้านใหม่ อ.เมือง จ.นครราชสีมา',
  phone: '0812345678',
  line: 'somchai.line',
  email: 'somchai@example.com',
  password: ''
};
let cohabit = {
  relation: 'คู่สมรส',
  prefix: 'นาง',
  firstname: 'สมหญิง',
  lastname: 'สุขใจ',
  address: '123 หมู่ 1 ต.บ้านใหม่ อ.เมือง จ.นครราชสีมา'
};

// GET /api/profile
router.get('/', (req, res) => {
  res.json({ profile, cohabit });
});

// POST /api/profile/save
router.post('/save', (req, res) => {
  if (req.body.cohabit) cohabit = req.body.cohabit;
  else profile = { ...profile, ...req.body };
  res.json({ success: true });
});

module.exports = router;
