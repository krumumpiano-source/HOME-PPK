import { Router } from 'express';

const router = Router();
let utilities = [];

/**
 * GET /api/utilities
 * Get utility readings
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: utilities,
    total: utilities.length
  });
});

/**
 * POST /api/utilities
 * Submit utility reading
 */
router.post('/', (req, res) => {
  const { residentId, month, year, waterReading, electricReading } = req.body;

  const now = new Date();
  const newUtility = {
    id: Date.now().toString(),
    residentId,
    month,
    year,
    waterReading: parseFloat(waterReading),
    electricReading: parseFloat(electricReading),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  utilities.push(newUtility);

  res.status(201).json({
    success: true,
    data: newUtility
  });
});

export default router;
