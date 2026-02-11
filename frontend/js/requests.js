// requests.js - HOME PPK
// SPEC: แจ้งซ่อม/คำร้อง ส่งคำร้องใหม่ + แสดงประวัติคำร้อง

const API_BASE = '/api/requests';

async function fetchRequests() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดประวัติคำร้อง');
  return await res.json();
}

async function submitRequest(formData) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) throw new Error('ส่งคำร้องไม่สำเร็จ');
  return await res.json();
}

function renderRequestHistory(data) {
  const section = document.getElementById('request-history-section');
  if (!data || !data.requests || data.requests.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบประวัติคำร้อง</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>วันที่</th><th>ประเภท</th><th>รายละเอียด</th><th>สถานะ</th></tr></thead><tbody>';
  data.requests.forEach(item => {
    html += `<tr><td>${item.date}</td><td>${item.type === 'repair' ? 'แจ้งซ่อม' : 'คำร้องทั่วไป'}</td><td>${item.detail}</td><td>${item.status}</td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

document.getElementById('request-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = {
    type: form.type.value,
    detail: form.detail.value
  };
  try {
    await submitRequest(formData);
    form.reset();
    const data = await fetchRequests();
    renderRequestHistory(data);
  } catch (err) {
    alert(err.message);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchRequests();
    renderRequestHistory(data);
  } catch (e) {
    document.getElementById('request-history-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
});
