import { Router } from 'express';

const router = Router();

/**
 * GET /api/statistics/dashboard
 * Get dashboard statistics
 */
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      totalResidents: 0,
      totalRevenue: 0,
      pendingPayments: 0,
      totalExpenses: 0
    }
  });
});

export default router;
