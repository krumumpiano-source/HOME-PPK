// backend/src/routes/forms.js
// SPEC: GET/POST แบบฟอร์ม 4 แบบ, mock ข้อมูล
const express = require('express');
const router = express.Router();

let forms = {
  request: [],
  move: [],
  repair: [],
  return: []
};

// GET /api/forms
router.get('/', (req, res) => {
  res.json(forms);
});

// POST /api/forms/save
router.post('/save', (req, res) => {
  const { type, formData } = req.body;
  if (!forms[type]) return res.status(400).json({ success: false });
  forms[type].push({ ...formData, date: new Date().toISOString() });
  res.json({ success: true });
});

module.exports = router;
