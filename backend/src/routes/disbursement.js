// backend/src/routes/disbursement.js
// SPEC: GET ตารางเบิกจ่าย, POST actual amount, คำนวณส่วนต่าง, mock ข้อมูล
import { Router } from 'express';
const router = Router();

// Mock config
const GARBAGE_FEE = 310;

let data = {
  water: 1200,
  electric: 1500,
  garbage: GARBAGE_FEE,
  others: [
    { title: 'ค่าซ่อมแซม', amount: 500, note: 'สำรองจ่ายโดยครูสมชาย' }
  ],
  total: 1200 + 1500 + GARBAGE_FEE + 500,
  actual: null,
  diff: null
};

// GET /api/disbursement
router.get('/', (req, res) => {
  res.json(data);
});

// POST /api/disbursement/actual
router.post('/actual', (req, res) => {
  const { amount } = req.body;
  data.actual = amount;
  if (amount > data.total) {
    data.diff = amount - data.total;
  } else {
    data.diff = 0;
  }
  res.json({ success: true });
});

export default router;
