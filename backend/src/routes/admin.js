import { Router } from 'express';

const router = Router();

/**
 * GET /api/admin/settings
 * Get system settings
 */
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    data: {
      companyName: 'HOME PPK',
      waterUnitPrice: 20,
      electricUnitPrice: 7.5,
      commonFee: 500
    }
  });
});

/**
 * PUT /api/admin/settings
 * Update system settings
 */
router.put('/settings', (req, res) => {
  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: req.body
  });
});

export default router;
