// electricity-record.js - HOME PPK
// SPEC: บันทึกค่าไฟ แยกบ้านพักครู/แฟลต ตาราง, กรอกค่าไฟล่าสุด, lost, ยอดรวม, ปัดเศษขึ้น, คำนวณส่วนต่าง

const API_BASE = '/api/electricity-record';

async function fetchElectricityRecord() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลค่าไฟ');
  return await res.json();
}

async function saveElectricity(unitId, latestValue) {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ unitId, latestValue })
  });
  return await res.json();
}

async function saveSummary(summary) {
  const res = await fetch(`${API_BASE}/summary`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(summary)
  });
  return await res.json();
}

function renderTable(data) {
  const section = document.getElementById('electricity-record-section');
  if (!data || (!data.houses && !data.flats)) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลค่าไฟ';
    return;
  }
  let html = '';
  function renderSubTable(title, list) {
    html += `<h2 style="margin-top:2rem;">${title}</h2>`;
    html += '<table class="table"><thead><tr>' +
      '<th>เลขประจำบ้าน</th><th>ชื่อผู้พัก</th><th>ค่าไฟล่าสุด</th><th>ยอดเงิน</th></tr></thead><tbody>';
    list.forEach(item => {
      html += `<tr><td>${item.unitId}</td>` +
        `<td>${item.name}</td>` +
        `<td><input type="number" min="0" value="${item.latestValue || ''}" data-unit="${item.unitId}" class="input-electric"></td>` +
        `<td>${item.amount !== undefined ? Math.ceil(item.amount).toLocaleString() : '-'}</td></tr>`;
    });
    html += '</tbody></table>';
  }
  if (data.houses && data.houses.length) renderSubTable('บ้านพักครู', data.houses);
  if (data.flats && data.flats.length) renderSubTable('แฟลต', data.flats);
  section.innerHTML = html;

  // Add event listeners for input-electric
  document.querySelectorAll('.input-electric').forEach(input => {
    input.addEventListener('change', async e => {
      const unitId = input.dataset.unit;
      let latestValue = parseFloat(input.value);
      if (isNaN(latestValue)) return;
      latestValue = Math.ceil(latestValue); // ปัดเศษขึ้น
      const resp = await saveElectricity(unitId, latestValue);
      if (resp && resp.success) {
        await loadAndRender();
      }
    });
  });
}

function renderSummary(data) {
  const section = document.getElementById('electricity-summary-section');
  section.innerHTML = `<div class="card">
    <label>ยอดรวมค่าไฟที่ได้รับแจ้งจากการไฟฟ้า <input type="number" id="input-total-electric" value="${data.totalElectric || ''}" class="input"></label><br>
    <label>lost บ้านพักครู <input type="number" id="input-lost-house" value="${data.lostHouse || ''}" class="input"></label><br>
    <label>lost แฟลต <input type="number" id="input-lost-flat" value="${data.lostFlat || ''}" class="input"></label><br>
    <div style="margin-top:1rem;">ส่วนต่างค่าไฟ: <span id="electric-diff">${data.diff !== undefined ? data.diff.toLocaleString() : '-'}</span></div>
    <button class="btn btn-primary" id="btn-save-summary">บันทึก</button>
  </div>`;

  document.getElementById('btn-save-summary').onclick = async () => {
    const summary = {
      totalElectric: parseFloat(document.getElementById('input-total-electric').value),
      lostHouse: parseFloat(document.getElementById('input-lost-house').value),
      lostFlat: parseFloat(document.getElementById('input-lost-flat').value)
    };
    await saveSummary(summary);
    await loadAndRender();
  };
}

async function loadAndRender() {
  try {
    const data = await fetchElectricityRecord();
    renderTable(data);
    renderSummary(data);
  } catch (e) {
    document.getElementById('electricity-record-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
