// backend/src/routes/payment-history.js
// SPEC: API สำหรับประวัติการชำระ (GET /api/payments/history)
import { Router } from 'express';
const router = Router();

// Mock data: ประวัติการชำระ (แยกตามรอบบิล, รองรับหลายครั้งต่อรอบ)
const paymentHistory = [
  {
    month: 1,
    year: 2026,
    late_days: 0,
    payments: [
      { datetime: '2026-01-05 10:00', amount: 1200 }
    ]
  },
  {
    month: 12,
    year: 2025,
    late_days: 2,
    payments: [
      { datetime: '2026-01-02 09:00', amount: 1200 },
      { datetime: '2026-01-03 14:30', amount: 500 }
    ]
  }
];

// GET /api/payments/history
router.get('/', (req, res) => {
  res.json({ history: paymentHistory });
});

export default router;
