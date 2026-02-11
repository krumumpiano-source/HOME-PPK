// monthly-bill.js - HOME PPK
// SPEC: แจ้งยอดชำระประจำเดือน ตาราง, ส่งออกไฟล์, ส่งอีเมล, ทวงเงิน

const API_BASE = '/api/monthly-bill';

async function fetchMonthlyBill() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลแจ้งยอด');
  return await res.json();
}

function renderTable(data) {
  const section = document.getElementById('monthly-bill-section');
  if (!data || !data.bills || data.bills.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลแจ้งยอด</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>เลขหน่วย</th><th>ชื่อผู้พัก</th><th>มิเตอร์น้ำก่อนหน้า</th><th>มิเตอร์น้ำล่าสุด</th><th>ค่าน้ำ</th><th>ค่าไฟ</th><th>ค่าส่วนกลาง</th><th>ยอดรวม</th><th>สถานะ</th></tr></thead><tbody>';
  data.bills.forEach(item => {
    html += `<tr><td>${item.unitId}</td>` +
      `<td>${item.name}</td>` +
      `<td>${item.prevWater}</td>` +
      `<td>${item.latestWater}</td>` +
      `<td>${item.waterAmount.toLocaleString()}</td>` +
      `<td>${item.electricAmount.toLocaleString()}</td>` +
      `<td>${item.centralAmount.toLocaleString()}</td>` +
      `<td>${item.totalAmount.toLocaleString()}</td>` +
      `<td><span class="status-badge ${item.status === 'paid' ? 'status-paid' : item.status === 'pending' ? 'status-pending' : 'status-overdue'}">${item.status === 'paid' ? 'ชำระเสร็จสิ้น' : item.status === 'pending' ? 'รอตรวจสอบ' : 'ค้างชำระ'}</span></td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

function renderActions() {
  const section = document.getElementById('monthly-bill-actions');
  section.innerHTML = `<button class="btn btn-primary" id="btn-export-img">ส่งออกไฟล์รูปภาพ</button>
    <button class="btn btn-secondary" id="btn-export-sheet">ส่งออก Google Sheet</button>
    <button class="btn btn-primary" id="btn-send-email">ส่งอีเมลใบแจ้งยอด</button>
    <button class="btn btn-danger" id="btn-remind">ทวงเงินค้างชำระ</button>`;
  // TODO: Add event listeners for export/send/remind
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchMonthlyBill();
    renderTable(data);
    renderActions();
  } catch (e) {
    document.getElementById('monthly-bill-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
});
