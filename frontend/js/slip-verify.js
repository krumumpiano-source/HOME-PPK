// slip-verify.js - HOME PPK
// SPEC: ตรวจสลิป ตาราง, อนุมัติ, ส่งอีเมลใบเสร็จ

const API_BASE = '/api/slip-verify';

async function fetchSlipVerify() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลสลิป');
  return await res.json();
}

async function approveSlip(id) {
  const res = await fetch(`${API_BASE}/approve`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  return await res.json();
}

async function sendReceipt(id) {
  const res = await fetch(`${API_BASE}/send-receipt`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  return await res.json();
}

function renderTable(data) {
  const section = document.getElementById('slip-verify-section');
  if (!data || !data.slips || data.slips.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลสลิป</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>รอบบิล</th><th>ชื่อผู้พัก</th><th>ยอด</th><th>สลิป</th><th>สถานะ</th><th>อนุมัติ</th><th>ส่งใบเสร็จ</th></tr></thead><tbody>';
  data.slips.forEach(item => {
    html += `<tr><td>${item.bill}</td>` +
      `<td>${item.name}</td>` +
      `<td>${item.amount.toLocaleString()}</td>` +
      `<td>${item.image ? `<img src="${item.image}" style="max-width:120px;">` : '-'}</td>` +
      `<td><span class="status-badge ${item.status === 'approved' ? 'status-paid' : item.status === 'pending' ? 'status-pending' : 'status-overdue'}">${item.status === 'approved' ? 'อนุมัติแล้ว' : item.status === 'pending' ? 'รอตรวจสอบ' : 'ค้างชำระ'}</span></td>` +
      `<td><button class="btn btn-primary" onclick="approveSlip('${item.id}')">อนุมัติ</button></td>` +
      `<td><button class="btn btn-secondary" onclick="sendReceipt('${item.id}')">ส่งใบเสร็จ</button></td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

async function loadAndRender() {
  try {
    const data = await fetchSlipVerify();
    renderTable(data);
  } catch (e) {
    document.getElementById('slip-verify-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
window.approveSlip = async (id) => { await approveSlip(id); await loadAndRender(); };
window.sendReceipt = async (id) => { await sendReceipt(id); await loadAndRender(); };
