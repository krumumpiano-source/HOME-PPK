// backend/src/routes/accounting.js
// SPEC: GET ตารางบัญชี, POST บันทึกรายรับรายจ่าย, รออนุมัติแอดมิน, mock ข้อมูล
import { Router } from 'express';
const router = Router();

let entries = [
  { date: '2026-02-01', type: 'income', title: 'ค่าส่วนกลาง', amount: 330, status: 'approved' },
  { date: '2026-02-01', type: 'income', title: 'ค่าไฟส่วนต่าง', amount: 20, status: 'approved' },
  { date: '2026-02-01', type: 'expense', title: 'ค่าขยะ', amount: 310, status: 'approved' },
  { date: '2026-02-01', type: 'expense', title: 'ค่าไฟหน่วยว่าง', amount: 18, status: 'approved' },
  { date: '2026-02-01', type: 'expense', title: 'ค่าซ่อมแซม', amount: 500, status: 'pending' }
];

// GET /api/accounting
router.get('/', (req, res) => {
  res.json({ entries });
});

// POST /api/accounting/save
router.post('/save', (req, res) => {
  const { type, title, amount } = req.body;
  const entry = {
    date: new Date().toISOString().slice(0, 10),
    type,
    title,
    amount,
    status: 'pending'
  };
  entries.unshift(entry);
  res.json({ success: true });
});

export default router;
