import { Router } from 'express';

const router = Router();

// Mock data for demo (replace with DB logic in production)
const bills = [
  {
    bill_id: 'b1',
    month: 2,
    year: 2569,
    amount: 1200,
    status: 'unpaid', // unpaid | pending | paid
    due_date: '2026-02-15',
    unit_id: 'U001',
    resident_id: 'demo-resident'
  },
  {
    bill_id: 'b0',
    month: 1,
    year: 2569,
    amount: 1100,
    status: 'unpaid',
    due_date: '2026-01-15',
    unit_id: 'U001',
    resident_id: 'demo-resident'
  }
];

// Helper: business days overdue
function businessDaysOverdue(dueDateStr) {
  const WORKING_DAYS = [1,2,3,4,5]; // Mon-Fri
  const due = new Date(dueDateStr);
  const now = new Date();
  let days = 0;
  let d = new Date(due.getTime());
  while (d < now) {
    if (WORKING_DAYS.includes(d.getDay())) days++;
    d.setDate(d.getDate() + 1);
  }
  return days > 0 ? days : 0;
}

// GET /api/current-bill
router.get('/', (req, res) => {
  // TODO: use req.user/resident_id from session/auth in production
  const resident_id = 'demo-resident';
  // Find current bill (latest by month/year)
  const bill = bills.find(b => b.resident_id === resident_id && b.status !== 'paid');
  // Find overdue bills (before current)
  const overdue = bills.filter(b => b.resident_id === resident_id && b.status === 'unpaid' && b !== bill)
    .map(b => ({
      bill_id: b.bill_id,
      amount: b.amount,
      overdue_days: businessDaysOverdue(b.due_date)
    }));
  res.json({
    bill,
    overdue
  });
});

export default router;
