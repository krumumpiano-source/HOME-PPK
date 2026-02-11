// disbursement.js - HOME PPK
// SPEC: เบิกจ่าย ตาราง, กรอกยอดรวมที่ประสงค์เบิกจ่ายจริง, คำนวณส่วนต่าง, บันทึก

const API_BASE = '/api/disbursement';

async function fetchDisbursement() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลเบิกจ่าย');
  return await res.json();
}

async function saveActualAmount(amount) {
  const res = await fetch(`${API_BASE}/actual`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  return await res.json();
}

function renderTable(data) {
  const section = document.getElementById('disbursement-section');
  if (!data) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลเบิกจ่าย</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>รายการ</th><th>ยอดเงิน</th><th>หมายเหตุ</th></tr></thead><tbody>';
  html += `<tr><td>ค่าน้ำประปา</td><td>${data.water.toLocaleString()}</td><td></td></tr>`;
  html += `<tr><td>ค่าไฟ</td><td>${data.electric.toLocaleString()}</td><td></td></tr>`;
  html += `<tr><td>ค่าขยะ</td><td>${data.garbage.toLocaleString()}</td><td></td></tr>`;
  data.others.forEach(item => {
    html += `<tr><td>${item.title}</td><td>${item.amount.toLocaleString()}</td><td>${item.note || ''}</td></tr>`;
  });
  html += `<tr><td><strong>ยอดรวมที่ต้องเบิกจ่าย</strong></td><td><strong>${data.total.toLocaleString()}</strong></td><td></td></tr>`;
  section.innerHTML = html;
}

function renderActions(data) {
  const section = document.getElementById('disbursement-actions');
  section.innerHTML = `<div class="card">
    <label>ยอดรวมที่ประสงค์เบิกจ่ายจริง <input type="number" id="input-actual-amount" value="${data.actual || ''}" class="input"></label><br>
    <button class="btn btn-primary" id="btn-save-actual">บันทึก</button>
    <div style="margin-top:1rem;">ส่วนต่าง: <span id="disbursement-diff">${data.diff !== undefined ? data.diff.toLocaleString() : '-'}</span></div>
  </div>`;
  document.getElementById('btn-save-actual').onclick = async () => {
    const amount = parseFloat(document.getElementById('input-actual-amount').value);
    await saveActualAmount(amount);
    await loadAndRender();
  };
}

async function loadAndRender() {
  try {
    const data = await fetchDisbursement();
    renderTable(data);
    renderActions(data);
  } catch (e) {
    document.getElementById('disbursement-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
