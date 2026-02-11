// admin-requests-queue.js - HOME PPK
// SPEC: แสดงคำร้องจากแบบฟอร์ม, จัดคิว, อนุมัติ, แจ้งสถานะ

const API_BASE = '/api/admin-requests-queue';

async function fetchRequestsQueue() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลคำร้อง');
  return await res.json();
}

async function updateStatus(id, status) {
  const res = await fetch(`${API_BASE}/status`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status })
  });
  return await res.json();
}

async function updateQueue(queue) {
  const res = await fetch(`${API_BASE}/queue`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queue })
  });
  return await res.json();
}

function renderRequestsTable(data) {
  const section = document.getElementById('admin-requests-section');
  if (!data || !data.requests || data.requests.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบคำร้อง</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>วันที่</th><th>ประเภท</th><th>รายละเอียด</th><th>สถานะ</th><th>อนุมัติ</th></tr></thead><tbody>';
  data.requests.forEach(item => {
    html += `<tr><td>${item.date}</td>` +
      `<td>${item.type}</td>` +
      `<td>${item.detail}</td>` +
      `<td><span class="status-badge ${item.status === 'approved' ? 'status-paid' : 'status-pending'}">${item.status === 'approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}</span></td>` +
      `<td><button class="btn btn-primary" onclick="updateStatus('${item.id}','approved')">อนุมัติ</button></td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

function renderQueue(data) {
  const section = document.getElementById('admin-queue-section');
  if (!data || !data.queue || data.queue.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบคิวผู้ขอพักอาศัย</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>ลำดับ</th><th>ชื่อ</th><th>ประเภท</th><th>สถานะ</th></tr></thead><tbody>';
  data.queue.forEach((item, idx) => {
    html += `<tr><td>${idx+1}</td>` +
      `<td>${item.name}</td>` +
      `<td>${item.type}</td>` +
      `<td><span class="status-badge ${item.status === 'approved' ? 'status-paid' : 'status-pending'}">${item.status === 'approved' ? 'อนุมัติแล้ว' : 'รออนุมัติ'}</span></td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

async function loadAndRender() {
  try {
    const data = await fetchRequestsQueue();
    renderRequestsTable(data);
    renderQueue(data);
  } catch (e) {
    document.getElementById('admin-requests-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
window.updateStatus = async (id, status) => { await updateStatus(id, status); await loadAndRender(); };
