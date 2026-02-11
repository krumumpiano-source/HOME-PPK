// regulations.js - HOME PPK
// SPEC: แสดงระเบียบ/ประกาศ

const API_BASE = '/api/regulations';

async function fetchRegulations() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลระเบียบ/ประกาศ');
  return await res.json();
}

function renderRegulationsTable(data) {
  const section = document.getElementById('regulations-section');
  if (!data || !data.regulations || data.regulations.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลระเบียบ/ประกาศ</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>วันที่</th><th>หัวข้อ</th><th>รายละเอียด</th></tr></thead><tbody>';
  data.regulations.forEach(item => {
    html += `<tr><td>${item.date}</td><td>${item.title}</td><td>${item.detail}</td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchRegulations();
    renderRegulationsTable(data);
  } catch (e) {
    document.getElementById('regulations-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
});
