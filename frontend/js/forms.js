// forms.js - HOME PPK
// SPEC: แบบฟอร์ม 4 แบบ, กรอกข้อมูล, ดึงข้อมูลผู้ใช้งาน, บันทึก, สั่งปริ้น

const API_BASE = '/api/forms';

async function fetchForms() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลแบบฟอร์ม');
  return await res.json();
}

async function saveForm(type, formData) {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, formData })
  });
  return await res.json();
}

function renderForms(data) {
  const section = document.getElementById('forms-section');
  section.innerHTML = '';
  const formTypes = [
    { type: 'request', title: 'คำร้องขอเข้าพักอาศัยบ้านพักครู' },
    { type: 'move', title: 'คำร้องขอย้ายบ้านพักหรือเปลี่ยนยูนิต' },
    { type: 'repair', title: 'แจ้งซ่อมแซมและบำรุงรักษา' },
    { type: 'return', title: 'คำร้องขอคืนบ้านพัก' }
  ];
  formTypes.forEach(ft => {
    section.innerHTML += `<div class="card" style="margin-bottom:2rem;">
      <h2>${ft.title}</h2>
      <form id="form-${ft.type}">
        <label>รายละเอียด <textarea name="detail" class="input"></textarea></label><br>
        <button class="btn btn-primary" type="submit">บันทึก</button>
        <button class="btn btn-secondary" type="button" onclick="window.print()">สั่งปริ้น</button>
      </form>
    </div>`;
  });
  formTypes.forEach(ft => {
    document.getElementById(`form-${ft.type}`).onsubmit = async e => {
      e.preventDefault();
      const form = e.target;
      const formData = { detail: form.detail.value };
      await saveForm(ft.type, formData);
    };
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const data = await fetchForms();
    renderForms(data);
  } catch (e) {
    document.getElementById('forms-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
});
