import { Router } from 'express';

const router = Router();
let payments = [];

// POST /api/payment
router.post('/', (req, res) => {
  const { bill_id, amount, slip_image } = req.body;
  // Prevent duplicate slip for same bill_id if pending/paid exists
  const already = payments.some(p => p.bill_id === bill_id && (p.status === 'pending' || p.status === 'paid'));
  if (already) {
    return res.status(400).json({ status: 'error', error: 'ส่งสลิปรอบนี้ไปแล้ว กรุณารอผลตรวจสอบ' });
  }
  const now = new Date();
  const newPayment = {
    payment_id: Date.now().toString(),
    bill_id,
    amount: parseFloat(amount),
    slip_image,
    status: 'pending',
    datetime: now.toISOString()
  };
  payments.push(newPayment);
  res.status(201).json({ status: 'pending', payment: newPayment });
});

export default router;
