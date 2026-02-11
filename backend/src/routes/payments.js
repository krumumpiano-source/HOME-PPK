import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();
let payments = [];

// Simple in-memory transporter configuration if environment variables provided
const mailTransporter = (function createTransporter() {
  // If MAIL_HOST env set, create real transporter
  if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  // Otherwise return null; we'll fallback to console.log
  return null;
})();

/**
 * GET /api/payments
 * Get all payments
 */
  let result = payments;
  if (req.query.residentId) {
    result = payments.filter(p => p.residentId === req.query.residentId);
  }
  res.json({
    success: true,
    data: result,
    total: result.length
  });
});
});

/**
 * POST /api/payments
 * Upload payment slip
 */
router.post('/', (req, res) => {
  // Prevent duplicate slip for same billId/residentId if pending/paid exists
  const already = payments.some(p => p.residentId === residentId && p.billId === billId && (p.status === 'pending' || p.status === 'paid' || p.status === 'approved'));
  if (already) {
    return res.status(400).json({ success: false, error: 'Slip already submitted for this bill. Please wait for approval.' });
  }
  const now = new Date();
  const newPayment = {
    id: Date.now().toString(),
    residentId,
    billId,
    amount: parseFloat(amount),
    imageUrl,
    status: 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };
  payments.push(newPayment);
  res.status(201).json({
    success: true,
    data: newPayment
  });
});
  });
});

/**
 * PUT /api/payments/:id/approve
 * Admin approves a payment: change status to 'paid' and optionally send receipt email
 */
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;
  const payment = payments.find(p => p.id === id);
  if (!payment) return res.status(404).json({ success: false, error: 'Payment not found' });

  payment.status = 'paid';
  payment.updatedAt = new Date().toISOString();

  // Send receipt email if transporter available
  try {
    if (mailTransporter) {
      const mailOptions = {
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: payment.residentEmail || process.env.ADMIN_EMAIL || process.env.MAIL_FROM,
        subject: `Receipt for payment ${payment.id}`,
        text: `Payment of ${payment.amount} has been received for bill ${payment.billId}. Receipt ID: ${payment.id}`
      };

      await mailTransporter.sendMail(mailOptions);
    } else {
      console.log('Receipt email (simulated):', {
        to: payment.residentEmail || process.env.ADMIN_EMAIL,
        subject: `Receipt for payment ${payment.id}`,
        text: `Payment of ${payment.amount} has been received for bill ${payment.billId}. Receipt ID: ${payment.id}`
      });
    }
  } catch (err) {
    console.error('Failed to send receipt email', err);
  }

  return res.json({ success: true, data: payment });
});

export default router;
