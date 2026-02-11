// payment-history.js - HOME PPK
// SPEC: แสดงประวัติการชำระ แยกตามรอบบิล รายละเอียด วันล่าช้า รองรับชำระหลายครั้ง

const API_BASE = '/api';

async function fetchPaymentHistory() {
  const res = await fetch(`${API_BASE}/payments/history`, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดประวัติการชำระ');
  return await res.json();
}

function renderHistoryTable(data) {
  const section = document.getElementById('history-section');
  if (!data || !data.history || data.history.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบประวัติการชำระ</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>รอบบิล</th><th>วันที่/เวลา</th><th>ยอดเงิน</th><th>จำนวนครั้ง</th><th>วันล่าช้า</th><th>สถานะ</th></tr></thead><tbody>';
  data.history.forEach(item => {
    html += `<tr><td>${item.month}/${item.year}</td>` +
      `<td>${item.payments.map(p=>p.datetime).join('<br>')}</td>` +
      `<td>${item.payments.map(p=>p.amount.toLocaleString()).join('<br>')}</td>` +
      `<td>${item.payments.length}</td>` +
      `<td>${item.late_days}</td>` +
      `<td><span class="status-badge ${item.status === 'paid' ? 'status-paid' : item.status === 'pending' ? 'status-pending' : 'status-overdue'}">${item.status === 'paid' ? 'ชำระเสร็จสิ้น' : item.status === 'pending' ? 'รอตรวจสอบ' : 'ค้างชำระ'}</span></td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchPaymentHistory();
    renderHistoryTable(data);
  } catch (e) {
    document.getElementById('history-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
});
