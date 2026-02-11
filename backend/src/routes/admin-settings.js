// backend/src/routes/admin-settings.js
// SPEC: GET/POST ตั้งค่าแอดมิน, mock ข้อมูล
const express = require('express');
const router = express.Router();

let settings = {
  waterRate: 8,
  electricRate: 5,
  centralFee: 110,
  lateDays: 3
};

// GET /api/admin-settings
router.get('/', (req, res) => {
  res.json(settings);
});

// POST /api/admin-settings/save
router.post('/save', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json({ success: true });
});

module.exports = router;
