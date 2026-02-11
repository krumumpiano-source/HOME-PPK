// accounting.js - HOME PPK
// SPEC: บัญชีรายรับรายจ่าย ตาราง, บันทึกรายรับรายจ่าย, รออนุมัติแอดมิน

const API_BASE = '/api/accounting';

async function fetchAccounting() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลบัญชี');
  return await res.json();
}

async function saveEntry(entry) {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  return await res.json();
}

function renderTable(data) {
  const section = document.getElementById('accounting-section');
  if (!data || !data.entries || data.entries.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลบัญชี</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>วันที่</th><th>ประเภท</th><th>รายการ</th><th>ยอดเงิน</th><th>สถานะ</th></tr></thead><tbody>';
  data.entries.forEach(item => {
    html += `<tr><td>${item.date}</td>` +
      `<td>${item.type === 'income' ? 'รายรับ' : 'รายจ่าย'}</td>` +
      `<td>${item.title}</td>` +
      `<td>${item.amount.toLocaleString()}</td>` +
      `<td><span class="status-badge ${item.status === 'approved' ? 'status-paid' : 'status-pending'}">${item.status === 'approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}</span></td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

function renderActions() {
  const section = document.getElementById('accounting-actions');
  section.innerHTML = `<div class="card">
    <label>ประเภท
      <select id="input-type" class="input">
        <option value="income">รายรับ</option>
        <option value="expense">รายจ่าย</option>
      </select>
    </label><br>
    <label>รายการ <input type="text" id="input-title" class="input"></label><br>
    <label>ยอดเงิน <input type="number" id="input-amount" class="input"></label><br>
    <button class="btn btn-primary" id="btn-save-entry">บันทึก</button>
  </div>`;
  document.getElementById('btn-save-entry').onclick = async () => {
    const entry = {
      type: document.getElementById('input-type').value,
      title: document.getElementById('input-title').value,
      amount: parseFloat(document.getElementById('input-amount').value)
    };
    await saveEntry(entry);
    await loadAndRender();
  };
}

async function loadAndRender() {
  try {
    const data = await fetchAccounting();
    renderTable(data);
    renderActions();
  } catch (e) {
    document.getElementById('accounting-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
