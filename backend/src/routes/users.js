import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getSheet, appendSheet, updateSheet } from '../GoogleSheetsService.js';

const router = Router();
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_USERS_ID;
const RANGE = 'Users!A2:V'; // ข้าม header row

// ============ ข้อมูลผู้พักอาศัยบ้านพักครู โรงเรียน PPK ============
// ข้อมูลจริง 32 หลัง (บ้านพักครู 17 หลัง + แฟลต 15 ห้อง)
const SEED_RESIDENTS = [
  // ===== บ้านพักครู (house) =====
  { id: '1', name: 'บ้านพักนักการ', type: 'house', unit: 'H1', role: 'resident', waterPrev: 162755, elecPrev: 0, coResidents: '' },
  { id: '2', name: 'นางสาวพิมพ์ใจ สมศรี', type: 'house', unit: 'H2', role: 'resident', waterPrev: 2175, elecPrev: 2156, coResidents: '' },
  { id: '3', name: 'นางบุษบา อริยะคำ', type: 'house', unit: 'H3', role: 'resident', waterPrev: 1999, elecPrev: 1982, coResidents: '' },
  { id: '4', name: 'นายรณชัย วรรณรัตน์', type: 'house', unit: 'H4', role: 'resident', waterPrev: 1149, elecPrev: 1116, coResidents: '' },
  { id: '5', name: 'นางสาวปิโยรส ใจเอื้อ', type: 'house', unit: 'H5', role: 'resident', waterPrev: 1552, elecPrev: 1549, coResidents: 'นางสาวชุลีมาศ คำบุญเรือง' },
  { id: '6', name: 'บ้านพักครูจีน', type: 'house', unit: 'H6', role: 'resident', waterPrev: 899, elecPrev: 695, coResidents: '' },
  { id: '7', name: 'นางสาวรัตนา สบายจิตร', type: 'house', unit: 'H7', role: 'resident', waterPrev: 1837, elecPrev: 1825, coResidents: '' },
  { id: '8', name: 'นายเจษฏาวัชส์ เสียงเย็น', type: 'house', unit: 'H8', role: 'resident', waterPrev: 1696, elecPrev: 1682, coResidents: 'นายอดิสรณ์ ปินตามูล' },
  { id: '9', name: 'นายพงศธร โพธิแก้ว', type: 'house', unit: 'H9', role: 'admin', waterPrev: 1834, elecPrev: 1808, coResidents: '' },
  { id: '10', name: 'นางจีรพา กันทา', type: 'house', unit: 'H10', role: 'resident', waterPrev: 2450, elecPrev: 2409, coResidents: '' },
  { id: '11', name: 'น.ส.ลัดดาวัลย์ บุญคุ้ม', type: 'house', unit: 'H11', role: 'resident', waterPrev: 1716, elecPrev: 1700, coResidents: '' },
  { id: '12', name: 'น.ส.ญาณกร ศรีชาติ', type: 'house', unit: 'H12', role: 'resident', waterPrev: 1418, elecPrev: 1405, coResidents: '' },
  { id: '13', name: 'นางดารากร จางคพิเชียร', type: 'house', unit: 'H13', role: 'resident', waterPrev: 1909, elecPrev: 1881, coResidents: '' },
  { id: '14', name: 'นางสาวเจนจิรา จันทร์หล้า', type: 'house', unit: 'H14', role: 'resident', waterPrev: 2270, elecPrev: 2249, coResidents: '' },
  { id: '15', name: 'น.ส.กานท์ชญา อ่อนนวล', type: 'house', unit: 'H15', role: 'resident', waterPrev: 3214, elecPrev: 3192, coResidents: '' },
  { id: '16', name: 'นางดวงจันทร์ หลายแห่ง', type: 'house', unit: 'H16', role: 'resident', waterPrev: 1179, elecPrev: 1164, coResidents: '' },
  { id: '17', name: 'นายเฉลิมพล ปามา', type: 'house', unit: 'H17', role: 'resident', waterPrev: 1835, elecPrev: 1826, coResidents: 'นายกัญจน์ณัฏฐ์ โลกคำลือ' },
  // ===== แฟลต (flat) =====
  { id: 'F1', name: 'นายณัฐพงศ์ คำเป็ง', type: 'flat', unit: 'F1', role: 'resident', waterPrev: 756, elecPrev: 753, coResidents: '' },
  { id: 'F2', name: 'น.ส.กันยา กันทะ', type: 'flat', unit: 'F2', role: 'resident', waterPrev: 1590, elecPrev: 0, coResidents: '' },
  { id: 'F3', name: 'น.ส.ขวัญดาว วงษ์พันธ์', type: 'flat', unit: 'F3', role: 'resident', waterPrev: 1501, elecPrev: 0, coResidents: 'น.ส.อรอนงค์ ยามเลย' },
  { id: 'F4', name: 'แฟลตครูญี่ปุ่น', type: 'flat', unit: 'F4', role: 'resident', waterPrev: 749, elecPrev: 0, coResidents: '' },
  { id: 'F5', name: 'นายสุมงคล จ่อยพิรัตน์', type: 'flat', unit: 'F5', role: 'resident', waterPrev: 1656, elecPrev: 0, coResidents: '' },
  { id: 'F6', name: 'นายทรงศักดิ์ แก้ววิลัย', type: 'flat', unit: 'F6', role: 'resident', waterPrev: 46, elecPrev: 0, coResidents: '' },
  { id: 'F7', name: 'นายพงศกร หงษ์ระนัย', type: 'flat', unit: 'F7', role: 'resident', waterPrev: 1255, elecPrev: 0, coResidents: '' },
  { id: 'F8', name: 'นายพงศกร วังศิลา', type: 'flat', unit: 'F8', role: 'resident', waterPrev: 1029, elecPrev: 0, coResidents: 'นายอภินันท์ ผ่องกมล' },
  { id: 'F9', name: 'น.ส.สุกันญา ตามสมัย', type: 'flat', unit: 'F9', role: 'resident', waterPrev: 50, elecPrev: 0, coResidents: 'น.ส.กัญนิกา สีเสน' },
  { id: 'F10', name: 'น.ส.ดารากรณ์ นาคสุกเอี่ยม', type: 'flat', unit: 'F10', role: 'resident', waterPrev: 57, elecPrev: 0, coResidents: '' },
  { id: 'F11', name: 'นางสาวกนกพร ภู่ปรางทอง', type: 'flat', unit: 'F11', role: 'resident', waterPrev: 917, elecPrev: 0, coResidents: '' },
  { id: 'F12', name: 'นายราชนุชา อินจันทร์', type: 'flat', unit: 'F12', role: 'resident', waterPrev: 31, elecPrev: 0, coResidents: '' },
  { id: 'F13', name: 'น.ส.จริญญา ศิลธรรม', type: 'flat', unit: 'F13', role: 'resident', waterPrev: 1728, elecPrev: 0, coResidents: 'น.ส.ปาริฉัตร์ คันธิสา' },
  { id: 'F14', name: 'นายจิรพันธ์ จันจินะ', type: 'flat', unit: 'F14', role: 'resident', waterPrev: 1294, elecPrev: 0, coResidents: 'นายอุดม พลทองมาก' },
  { id: 'F15', name: 'นางสาวรุจิรา กาจินา', type: 'flat', unit: 'F15', role: 'resident', waterPrev: 1349, elecPrev: 0, coResidents: '' },
  { id: 'F16', name: 'นายจรูญพงษ์ ชลสินธุ์', type: 'flat', unit: 'F16', role: 'resident', waterPrev: 36, elecPrev: 0, coResidents: '' },
];

// In-memory cache (seeded on startup, syncs with Google Sheets when available)
let users = SEED_RESIDENTS.map(r => ({
  id: r.id,
  name: r.name,
  type: r.type,
  unit: r.unit,
  role: r.role,
  status: 'active',
  waterPrev: r.waterPrev,
  elecPrev: r.elecPrev,
  coResidents: r.coResidents,
  email: '',
  phone: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

// Try to load from Google Sheets on startup (if configured)
async function loadFromSheets() {
  if (!SPREADSHEET_ID) return;
  try {
    const rows = await getSheet(SPREADSHEET_ID, RANGE);
    if (rows && rows.length > 0) {
      users = rows.map(row => ({
        id: row[0],
        title: row[1] || '',
        name: row[2] || '',
        surname: row[3] || '',
        email: row[4] || '',
        phone: row[5] || '',
        lineId: row[6] || '',
        role: row[7] || 'resident',
        unit: row[8] || '',
        type: row[9] || 'house',
        status: row[10] || 'active',
        waterPrev: Number(row[12]) || 0,
        elecPrev: Number(row[13]) || 0,
        coResidents: row[19] || '',
        createdAt: row[20] || '',
        updatedAt: row[21] || '',
      }));
      console.log(`✓ Loaded ${users.length} users from Google Sheets`);
    }
  } catch (err) {
    console.log('⚠ Google Sheets not available, using seed data:', err.message);
  }
}
loadFromSheets();

// Sync seed data to Google Sheets (one-time)
async function seedToSheets() {
  if (!SPREADSHEET_ID) return;
  try {
    const existing = await getSheet(SPREADSHEET_ID, RANGE);
    if (existing && existing.length > 0) {
      console.log('Google Sheets already has user data, skipping seed');
      return;
    }
    const now = new Date().toISOString();
    const values = SEED_RESIDENTS.map(r => [
      r.id, '', r.name, '', '', '', '', r.role, r.unit, r.type, 'active',
      '', r.waterPrev, r.elecPrev, '', '', '', '', '', r.coResidents, now, now
    ]);
    await appendSheet(SPREADSHEET_ID, 'Users!A2:V', values);
    console.log(`✓ Seeded ${values.length} residents to Google Sheets`);
  } catch (err) {
    console.log('⚠ Could not seed Google Sheets:', err.message);
  }
}
seedToSheets();

/**
 * GET /api/users
 * Get all users (residents)
 */
router.get('/', (req, res) => {
  try {
    const { type, role } = req.query;
    let result = users;
    if (type) result = result.filter(u => u.type === type);
    if (role) result = result.filter(u => u.role === role);
    res.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/users/residents
 * Get only residents (for electricity/water record pages)
 */
router.get('/residents', (req, res) => {
  try {
    const { type } = req.query;
    let result = users.filter(u => u.role === 'resident' || u.role === 'admin');
    if (type) result = result.filter(u => u.type === type);
    res.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/users
 * Create new user
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, role, unit, type, status = 'active', waterPrev, elecPrev, coResidents } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }

    const now = new Date().toISOString();
    const newUser = {
      id: req.body.id || uuidv4(),
      name,
      email: email || '',
      phone: phone || '',
      role: role || 'resident',
      unit: unit || '',
      type: type || 'house',
      status,
      waterPrev: waterPrev || 0,
      elecPrev: elecPrev || 0,
      coResidents: coResidents || '',
      createdAt: now,
      updatedAt: now,
    };

    users.push(newUser);

    // Sync to Google Sheets
    if (SPREADSHEET_ID) {
      try {
        const values = [[newUser.id, '', newUser.name, '', newUser.email, newUser.phone, '',
          newUser.role, newUser.unit, newUser.type, newUser.status, '',
          newUser.waterPrev, newUser.elecPrev, '', '', '', '', '', newUser.coResidents, now, now]];
        await appendSheet(SPREADSHEET_ID, 'Users!A2:V', values);
      } catch { /* continue with in-memory */ }
    }

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/users/:id
 * Update user
 */
router.put('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    Object.assign(user, req.body, { updatedAt: new Date().toISOString() });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete('/:id', (req, res) => {
  try {
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const deletedUser = users.splice(index, 1);
    res.json({ success: true, message: 'User deleted', data: deletedUser[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
