// backend/src/routes/slip-verify.js
// SPEC: GET ตารางสลิป, POST อนุมัติ, POST ส่งใบเสร็จ, mock ข้อมูล
import { Router } from 'express';
const router = Router();

let slips = [
  { id: '1', bill: '2/2026', name: 'สมชาย ใจดี', amount: 1110, image: 'https://via.placeholder.com/120x60?text=Slip1', status: 'pending' },
  { id: '2', bill: '2/2026', name: 'สมหญิง สุขใจ', amount: 570, image: 'https://via.placeholder.com/120x60?text=Slip2', status: 'pending' },
  { id: '3', bill: '2/2026', name: 'วราภรณ์ แฟลต', amount: 470, image: 'https://via.placeholder.com/120x60?text=Slip3', status: 'approved' }
];

// GET /api/slip-verify
router.get('/', (req, res) => {
  res.json({ slips });
});

// POST /api/slip-verify/approve
router.post('/approve', (req, res) => {
  const { id } = req.body;
  const slip = slips.find(s => s.id === id);
  if (slip) slip.status = 'approved';
  res.json({ success: true });
});

// POST /api/slip-verify/send-receipt
router.post('/send-receipt', (req, res) => {
  const { id } = req.body;
  // mock: just return success
  res.json({ success: true });
});

export default router;
