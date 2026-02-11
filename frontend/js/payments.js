// payments.js - HOME PPK
// SPEC: โหลดข้อมูลยอดบิลปัจจุบัน, ยอดค้าง, วันค้าง, สถานะ, ส่งสลิป (API only)

const API_BASE = '/api';

async function fetchCurrentBill() {
  const res = await fetch(`${API_BASE}/current-bill`, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลบิล');
  return await res.json();
}

async function postPayment({ bill_id, amount, slip_image }) {
  const res = await fetch(`${API_BASE}/payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ bill_id, amount, slip_image })
  });
  return await res.json();
}

function renderCurrentBill(data) {
  const section = document.getElementById('current-bill-section');
  if (!data || !data.bill) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลบิลรอบปัจจุบัน</div>';
    return;
  }
  let html = `<div><strong>ยอดที่ต้องชำระ:</strong> ${data.bill.amount.toLocaleString()} บาท`;
  if (data.bill.status === 'unpaid') html += ' <span class="status-badge status-unpaid">⏳ รอชำระ</span>';
  if (data.bill.status === 'pending') html += ' <span class="status-badge status-pending">🔍 รอตรวจสอบ</span>';
  if (data.bill.status === 'paid') html += ' <span class="status-badge status-paid">✅ ชำระเสร็จสิ้น</span>';
  html += '</div>';
  if (data.overdue && data.overdue.length > 0) {
    html += '<div class="overdue-list">';
    data.overdue.forEach(item => {
      html += `<div>ยอดค้าง ${item.amount.toLocaleString()} บาท (เลย ${item.overdue_days} วันทำการ)</div>`;
    });
    html += '</div>';
  }
  section.innerHTML = html;
}

function showModal(show) {
  document.getElementById('upload-slip-modal').style.display = show ? 'block' : 'none';
}

document.getElementById('btn-upload-slip').onclick = () => showModal(true);
document.getElementById('btn-cancel-upload').onclick = () => showModal(false);

document.getElementById('form-upload-slip').onsubmit = async function(e) {
  e.preventDefault();
  const bill_id = document.getElementById('select-bill').value;
  const amount = document.getElementById('input-amount').value;
  const file = document.getElementById('input-slip-image').files[0];
  if (!bill_id || !amount || !file) return alert('กรุณากรอกข้อมูลให้ครบ');
  const reader = new FileReader();
  reader.onload = async function() {
    const slip_image = reader.result;
    const resp = await postPayment({ bill_id, amount, slip_image });
    if (resp && resp.status === 'pending') {
      document.getElementById('status-message').textContent = 'ส่งสลิปสำเร็จ รอตรวจสอบ';
      showModal(false);
      await loadAndRender();
    } else {
      document.getElementById('status-message').textContent = resp.error || 'เกิดข้อผิดพลาด';
    }
  };
  reader.readAsDataURL(file);
};

async function loadAndRender() {
  try {
    const data = await fetchCurrentBill();
    renderCurrentBill(data);
    // เติม select รอบบิล
    const select = document.getElementById('select-bill');
    select.innerHTML = '';
    if (data && data.bill) {
      const opt = document.createElement('option');
      opt.value = data.bill.bill_id;
      opt.textContent = `${data.bill.month}/${data.bill.year} - ${data.bill.amount} บาท`;
      opt.disabled = data.bill.status === 'pending' || data.bill.status === 'paid';
      select.appendChild(opt);
      select.value = data.bill.bill_id;
      document.getElementById('input-amount').value = data.bill.amount;
    }
  } catch (e) {
    document.getElementById('current-bill-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
