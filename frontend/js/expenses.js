// expenses.js - HOME PPK
// SPEC: แสดงค่าใช้จ่ายอื่น ๆ (ไม่ใช่ค่าน้ำ/ไฟ)

const API_BASE = '/api/expenses';

async function fetchExpenses() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลค่าใช้จ่าย');
  return await res.json();
}

function renderExpensesTable(data) {
  const section = document.getElementById('expenses-section');
  if (!data || !data.expenses || data.expenses.length === 0) {
    section.innerHTML = '<div class="alert">ไม่พบข้อมูลค่าใช้จ่าย</div>';
    return;
  }
  let html = '<table class="table"><thead><tr>' +
    '<th>วันที่</th><th>รายการ</th><th>จำนวนเงิน</th><th>หมายเหตุ</th></tr></thead><tbody>';
  data.expenses.forEach(item => {
    html += `<tr><td>${item.date}</td><td>${item.title}</td><td>${item.amount.toLocaleString()}</td><td>${item.note || ''}</td></tr>`;
  });
  html += '</tbody></table>';
  section.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchExpenses();
    renderExpensesTable(data);
  } catch (e) {
    document.getElementById('expenses-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
});
