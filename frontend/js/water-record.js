// water-record.js - HOME PPK
// SPEC: บันทึกค่าน้ำ แยกบ้านพักครู/แฟลต ตาราง, กรอกเลขมิเตอร์ล่าสุด, คำนวณยอดเงินอัตโนมัติ

const API_BASE = '/api/water-record';

async function fetchWaterRecord() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลค่าน้ำ');
  return await res.json();
}

async function saveMeter(unitId, latestMeter) {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ unitId, latestMeter })
  });
  return await res.json();
}

function renderTable(data) {
  const section = document.getElementById('water-record-section');
  if (!data || (!data.houses && !data.flats)) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลค่าน้ำ';
    return;
  }
  let html = '';
  function renderSubTable(title, list) {
    html += `<h2 style="margin-top:2rem;">${title}</h2>`;
    html += '<table class="table"><thead><tr>' +
      '<th>เลขประจำบ้าน</th><th>ชื่อผู้พัก</th><th>มิเตอร์ก่อนหน้า</th><th>มิเตอร์ล่าสุด</th><th>ค่าน้ำ</th></tr></thead><tbody>';
    list.forEach(item => {
      html += `<tr><td>${item.unitId}</td>` +
        `<td>${item.name}</td>` +
        `<td>${item.prevMeter}</td>` +
        `<td><input type="number" min="0" value="${item.latestMeter || ''}" data-unit="${item.unitId}" class="input-meter"></td>` +
        `<td>${item.amount !== undefined ? item.amount.toLocaleString() : '-'}</td></tr>`;
    });
    html += '</tbody></table>';
  }
  if (data.houses && data.houses.length) renderSubTable('บ้านพักครู', data.houses);
  if (data.flats && data.flats.length) renderSubTable('แฟลต', data.flats);
  section.innerHTML = html;

  // Add event listeners for input-meter
  document.querySelectorAll('.input-meter').forEach(input => {
    input.addEventListener('change', async e => {
      const unitId = input.dataset.unit;
      const latestMeter = parseInt(input.value, 10);
      if (isNaN(latestMeter)) return;
      const resp = await saveMeter(unitId, latestMeter);
      if (resp && resp.success) {
        await loadAndRender();
      }
    });
  });
}

async function loadAndRender() {
  try {
    const data = await fetchWaterRecord();
    renderTable(data);
  } catch (e) {
    document.getElementById('water-record-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
