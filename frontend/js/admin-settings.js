// admin-settings.js - HOME PPK
// SPEC: ตั้งค่าแอดมิน, อัตราค่าน้ำ/ไฟ/ส่วนกลาง, เพิ่ม/ลบหน่วยพัก, กำหนดสิทธิ์, สำรองข้อมูล

const API_BASE = '/api/admin-settings';

async function fetchSettings() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลตั้งค่า');
  return await res.json();
}

async function saveSettings(settings) {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return await res.json();
}

function renderSettingsForm(data) {
  const section = document.getElementById('admin-settings-section');
  section.innerHTML = `<form id="settings-form">
    <label>อัตราค่าน้ำต่อหน่วย <input type="number" name="waterRate" value="${data.waterRate || ''}" class="input"></label><br>
    <label>อัตราค่าไฟต่อหน่วย <input type="number" name="electricRate" value="${data.electricRate || ''}" class="input"></label><br>
    <label>ค่าส่วนกลาง <input type="number" name="centralFee" value="${data.centralFee || ''}" class="input"></label><br>
    <label>จำนวนวันล่าช้า (วันทำการ) <input type="number" name="lateDays" value="${data.lateDays || ''}" class="input"></label><br>
    <button class="btn btn-primary" type="submit">บันทึก</button>
  </form>`;
  document.getElementById('settings-form').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const settings = {
      waterRate: parseFloat(form.waterRate.value),
      electricRate: parseFloat(form.electricRate.value),
      centralFee: parseFloat(form.centralFee.value),
      lateDays: parseInt(form.lateDays.value, 10)
    };
    await saveSettings(settings);
  };
}

async function loadAndRender() {
  try {
    const data = await fetchSettings();
    renderSettingsForm(data);
  } catch (e) {
    document.getElementById('admin-settings-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
