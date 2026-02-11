// AdminRequestsQueue.js - mock API for admin-requests-queue
const express = require('express');
const router = express.Router();

// Mock data
let requests = [
  { id: '1', date: '2024-06-01', type: 'ขอพักอาศัย', detail: 'ขอพักอาศัยบ้านครู', status: 'pending' },
  { id: '2', date: '2024-06-02', type: 'ขอซ่อมแซม', detail: 'ซ่อมไฟฟ้า', status: 'pending' }
];
let queue = [
  { id: '1', name: 'สมชาย', type: 'ขอพักอาศัย', status: 'pending' },
  { id: '2', name: 'สมหญิง', type: 'ขอซ่อมแซม', status: 'pending' }
];

router.get('/', (req, res) => {
  res.json({ requests, queue });
});

router.post('/status', (req, res) => {
  const { id, status } = req.body;
  const reqIdx = requests.findIndex(r => r.id === id);
  if (reqIdx !== -1) {
    requests[reqIdx].status = status;
    // Also update queue if needed
    const queueIdx = queue.findIndex(q => q.id === id);
    if (queueIdx !== -1) queue[queueIdx].status = status;
    return res.json({ success: true });
  }
  res.status(404).json({ error: 'Request not found' });
});

router.post('/queue', (req, res) => {
  const { queue: newQueue } = req.body;
  if (Array.isArray(newQueue)) {
    queue = newQueue;
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Invalid queue' });
});

module.exports = router;
