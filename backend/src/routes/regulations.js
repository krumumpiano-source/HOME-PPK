
import { Router } from 'express';
const router = Router();
const regulations = [
  { date: '2026-02-01', title: 'งดใช้น้ำชั่วคราว', detail: 'จะมีการปิดน้ำเพื่อซ่อมแซมในวันที่ 3 ก.พ. 2026' },
  { date: '2026-01-10', title: 'ประกาศห้ามเลี้ยงสัตว์', detail: 'ห้ามเลี้ยงสัตว์ในหอพักทุกชนิด' },
  { date: '2025-12-25', title: 'แจ้งเตือนปีใหม่', detail: 'โปรดระวังทรัพย์สินช่วงวันหยุดยาว' }
];


// GET /api/regulations
router.get('/', (req, res) => {
  res.json({ regulations });
});



export default router;
