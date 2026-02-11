// profile.js - HOME PPK
// SPEC: ข้อมูลส่วนตัว, ผู้ร่วมพักอาศัย, ฟอร์มแก้ไข, ดรอปดาวน์จังหวัด/อำเภอ/ตำบล/หมู่บ้าน

const API_BASE = '/api/profile';

async function fetchProfile() {
  const res = await fetch(API_BASE, { credentials: 'include' });
  if (!res.ok) throw new Error('ไม่สามารถโหลดข้อมูลส่วนตัว');
  return await res.json();
}

async function saveProfile(profile) {
  const res = await fetch(`${API_BASE}/save`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });
  return await res.json();
}

function renderProfileForm(data) {
  const section = document.getElementById('profile-section');
  section.innerHTML = `<form id="profile-form">
    <label>คำนำหน้า <input type="text" name="prefix" value="${data.prefix || ''}" class="input"></label><br>
    <label>ชื่อ <input type="text" name="firstname" value="${data.firstname || ''}" class="input"></label><br>
    <label>นามสกุล <input type="text" name="lastname" value="${data.lastname || ''}" class="input"></label><br>
    <label>ที่อยู่ตามบัตรประชาชน <input type="text" name="address" value="${data.address || ''}" class="input"></label><br>
    <label>เบอร์โทรศัพท์ <input type="text" name="phone" value="${data.phone || ''}" class="input"></label><br>
    <label>LINE ID <input type="text" name="line" value="${data.line || ''}" class="input"></label><br>
    <label>อีเมล <input type="email" name="email" value="${data.email || ''}" class="input"></label><br>
    <label>รหัสผ่าน <input type="password" name="password" class="input"></label><br>
    <button class="btn btn-primary" type="submit">บันทึก</button>
  </form>`;
  document.getElementById('profile-form').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const profile = {
      prefix: form.prefix.value,
      firstname: form.firstname.value,
      lastname: form.lastname.value,
      address: form.address.value,
      phone: form.phone.value,
      line: form.line.value,
      email: form.email.value,
      password: form.password.value
    };
    await saveProfile(profile);
  };
}

function renderCohabitForm(data) {
  const section = document.getElementById('cohabit-section');
  section.innerHTML = `<form id="cohabit-form">
    <label>ความสัมพันธ์ <input type="text" name="relation" value="${data.relation || ''}" class="input"></label><br>
    <label>คำนำหน้า <input type="text" name="prefix" value="${data.prefix || ''}" class="input"></label><br>
    <label>ชื่อ <input type="text" name="firstname" value="${data.firstname || ''}" class="input"></label><br>
    <label>นามสกุล <input type="text" name="lastname" value="${data.lastname || ''}" class="input"></label><br>
    <label>ที่อยู่ตามบัตรประชาชน <input type="text" name="address" value="${data.address || ''}" class="input"></label><br>
    <button class="btn btn-primary" type="submit">บันทึก</button>
  </form>`;
  document.getElementById('cohabit-form').onsubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const cohabit = {
      relation: form.relation.value,
      prefix: form.prefix.value,
      firstname: form.firstname.value,
      lastname: form.lastname.value,
      address: form.address.value
    };
    await saveProfile({ cohabit });
  };
}

async function loadAndRender() {
  try {
    const data = await fetchProfile();
    renderProfileForm(data.profile || {});
    renderCohabitForm(data.cohabit || {});
  } catch (e) {
    document.getElementById('profile-section').innerHTML = '<div class="alert">โหลดข้อมูลล้มเหลว</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);
