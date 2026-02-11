// README: วิธีตั้งค่า Google Service Account สำหรับ Google Sheets API

1. ไปที่ Google Cloud Console (https://console.cloud.google.com/)
2. สร้าง Project ใหม่ หรือเลือก Project ที่ต้องการ
3. ไปที่เมนู "APIs & Services" > "Credentials"
4. กด "Create Credentials" > "Service account"
5. ตั้งชื่อและสร้าง Service Account
6. กดเข้า Service Account ที่สร้าง แล้วไปที่แท็บ "KEYS" > "Add Key" > "Create new key" เลือก JSON
7. ดาวน์โหลดไฟล์ JSON แล้วนำไปวางที่ backend/google-service-account.json
8. เปิด Google Sheets ทุกไฟล์ที่ต้องการเชื่อมต่อ กด "แชร์" (Share) ใส่อีเมลของ Service Account (ดูได้จาก client_email ในไฟล์ JSON) แล้วให้สิทธิ์ "Editor"
9. ตรวจสอบ .env ให้ GOOGLE_SERVICE_ACCOUNT_PATH ชี้ไปที่ไฟล์ JSON
10. ทดสอบเชื่อมต่อด้วย GoogleSheetsService.js

หมายเหตุ: Service Account ต้องมีสิทธิ์ Editor ใน Google Sheets ทุกไฟล์ที่ต้องการใช้งาน
