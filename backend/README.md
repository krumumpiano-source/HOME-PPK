## Deployment & GitHub Preparation

### 1. ห้าม commit ไฟล์สำคัญ
- backend/google-service-account.json (ถูก ignore แล้ว)
- backend/.env (ใช้ .env.example แทน)

### 2. การตั้งค่า .env
ให้ copy ไฟล์ .env.example ไปเป็น .env แล้วกรอกค่า Sheet ID และ Service Account Path ให้ถูกต้อง

### 3. แชร์สิทธิ์ Google Sheets ให้ service account (email ในไฟล์ json)

### 4. Deploy to Render
- ตรวจสอบว่าใน github ไม่มีไฟล์ credentials จริง
- Render จะใช้ .env ที่ตั้งค่าไว้

### 5. ติดตั้ง dependencies
```
cd backend
npm install
```

### 6. Start server (local)
```
npm run dev
```

### 7. ตรวจสอบ health
เปิด http://localhost:3000/health

---
**หมายเหตุ:**
หากต้องการ deploy production ให้ตั้งค่า NODE_ENV=production และ FRONTEND_URL ให้ตรงกับโดเมนจริง
