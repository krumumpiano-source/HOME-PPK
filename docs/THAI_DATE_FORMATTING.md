# Thai Date Formatting Guide

## 📅 ภาพรวม

ระบบ HOME PPK ได้รับการปรับปรุงให้แสดงวันที่ในรูปแบบไทย (วันที่ เดือนเต็มไทย ปี พ.ศ.) ทั่วทั้งแอปพลิเคชัน

**ตัวอย่าง:**
- ❌ February 10, 2026 
- ✅ 10 กุมภาพันธ์ 2569

---

## 🛠️ Utilities

### Utility Functions (`frontend/src/utils/dateUtils.ts`)

```typescript
import {
  formatDateThai,              // "10 กุมภาพันธ์ 2569"
  formatDateTimeThaiWithTime, // "10 กุมภาพันธ์ 2569 เวลา 14:30"
  formatDateThaiWithDayName,  // "จันทร์ 10 กุมภาพันธ์ 2569"
  formatDateRangeThai,        // "10 - 20 กุมภาพันธ์ 2569"
  formatMonthYearThai,        // "กุมภาพันธ์ 2569"
  formatRelativeTimeThai,     // "เมื่อ 2 วันที่แล้ว"
  formatTimeThai,             // "14:30" หรือ "14:30:45"
  gregorianToBuddhist         // แปลง พ.ศ.
} from '@/utils/dateUtils';
```

---

## 💡 วิธีการใช้

### 1️⃣ ใช้ Component (แนะนำ)

```typescript
import { FormattedDate } from '@/components/FormattedDate';

// ส่วน Default format
<FormattedDate date={new Date()} />
// Output: "10 กุมภาพันธ์ 2569"

// ส่วน With time
<FormattedDate date={new Date()} format="with-time" />
// Output: "10 กุมภาพันธ์ 2569 เวลา 14:30"

// ส่วน With day name
<FormattedDate date={new Date()} format="with-day" />
// Output: "จันทร์ 10 กุมภาพันธ์ 2569"

// ส่วน Relative time
<FormattedDate date={new Date()} format="relative" />
// Output: "เมื่อ 2 นาทีที่แล้ว"

// ส่วน Month and year
<FormattedDate date={new Date()} format="month-year" />
// Output: "กุมภาพันธ์ 2569"

// ส่วน Time only
<FormattedDate date={new Date()} format="time-only" />
// Output: "14:30"
```

---

### 2️⃣ ใช้ Hook

```typescript
import { useDateFormatter } from '@/components/FormattedDate';

export function MyComponent() {
  const { date, dateTime, dateWithDay, monthYear, relativeTime, time } = useDateFormatter();

  return (
    <div>
      <p>{date(new Date())}</p>
      <p>{dateTime(new Date())}</p>
      <p>{relativeTime(new Date())}</p>
    </div>
  );
}
```

---

### 3️⃣ ใช้ Utility Functions โดยตรง

```typescript
import { formatDateThai, formatDateTimeThaiWithTime } from '@/utils/dateUtils';

export function MyComponent() {
  const createdAt = new Date();

  return (
    <div>
      <p>สร้างเมื่อ {formatDateThai(createdAt)}</p>
      <p>อัปเดตเมื่อ {formatDateTimeThaiWithTime(createdAt)}</p>
    </div>
  );
}
```

---

## 📊 ตัวอย่างการใช้งาน

### ตัวอย่าง 1: ตารางข้อมูล

```typescript
<table>
  <tbody>
    {users.map(user => (
      <tr key={user.id}>
        <td>{user.name}</td>
        <td>
          <FormattedDate date={user.createdAt} format="with-time" />
        </td>
        <td>
          <FormattedDate date={user.updatedAt} format="relative" />
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### ตัวอย่าง 2: บัตรข้อมูล

```typescript
<div className="card">
  <h3>ใบแจ้งหนี้</h3>
  <p>งวด: <FormattedDate date={bill.date} format="month-year" /></p>
  <p>สร้างเมื่อ: <FormattedDate date={bill.createdAt} format="with-time" /></p>
  <p>ยอดชำระ: {bill.amount} บาท</p>
</div>
```

### ตัวอย่าง 3: ประวัติการทำรายการ

```typescript
<div className="timeline">
  {transactions.map(tx => (
    <div key={tx.id}>
      <span className="date">
        <FormattedDate date={tx.date} />
      </span>
      <span className="description">{tx.description}</span>
      <span className="amount">{tx.amount} บาท</span>
    </div>
  ))}
</div>
```

---

## 🎨 Component Props

### `FormattedDate`

```typescript
interface FormattedDateProps {
  date: Date | string | number;  // วันที่ที่ต้องการแปลง
  format?: 'default' | 'with-time' | 'with-day' | 'month-year' | 'relative' | 'time-only';
  className?: string;             // CSS class สำหรับ styling
}
```

### `FormattedDateRange`

```typescript
interface FormattedDateRangeProps {
  startDate: Date | string | number;  // วันที่เริ่มต้น
  endDate: Date | string | number;    // วันที่สิ้นสุด
  className?: string;                  // CSS class
}
```

---

## 🔄 Backend Integration

### API Response Format

Backend ส่ง timestamp ในรูปแบบ ISO 8601:

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John",
    "createdAt": "2026-02-10T14:30:00.000Z",
    "updatedAt": "2026-02-10T15:45:00.000Z"
  }
}
```

### Frontend Display

Frontend format ISO timestamp เป็นไทย:

```typescript
// Backend sends: "2026-02-10T14:30:00.000Z"
<FormattedDate date={user.createdAt} format="with-time" />
// Display: "10 กุมภาพันธ์ 2569 เวลา 14:30"
```

---

## 📝 Month Names (เดือน)

| ลำดับ | ชื่อไทย | English |
|------|--------|---------|
| 1 | มกราคม | January |
| 2 | กุมภาพันธ์ | February |
| 3 | มีนาคม | March |
| 4 | เมษายน | April |
| 5 | พฤษภาคม | May |
| 6 | มิถุนายน | June |
| 7 | กรกฎาคม | July |
| 8 | สิงหาคม | August |
| 9 | กันยายน | September |
| 10 | ตุลาคม | October |
| 11 | พฤศจิกายน | November |
| 12 | ธันวาคม | December |

---

## 📆 Day Names (วัน)

| ลำดับ | ชื่อไทย | English |
|------|--------|---------|
| 0 | อาทิตย์ | Sunday |
| 1 | จันทร์ | Monday |
| 2 | อังคาร | Tuesday |
| 3 | พุธ | Wednesday |
| 4 | พฤหัสบดี | Thursday |
| 5 | ศุกร์ | Friday |
| 6 | เสาร์ | Saturday |

---

## 🚀 ตัวอย่างที่ใช้งานจริง

### ไฟล์ที่ใช้ Thai Date Formatting:

1. **`frontend/src/app/App.tsx`** - Footer date display
2. **`frontend/src/components/FormattedDate.tsx`** - Main component & hook
3. **`frontend/src/components/ExampleDataDisplays.tsx`** - Example tables & cards
4. **`frontend/src/utils/dateUtils.ts`** - Utility functions

### Backend Files (ISO Timestamp):

- `backend/src/routes/users.js`
- `backend/src/routes/bills.js`
- `backend/src/routes/payments.js`
- `backend/src/routes/requests.js`
- `backend/src/routes/expenses.js`
- `backend/src/routes/utilities.js`
- `backend/src/routes/regulations.js`

---

## 🎯 Best Practices

✅ **ทำ (Do):**
- ใช้ `<FormattedDate>` Component ในทุก JSX
- ใช้ ISO format จาก Backend
- เลือก format ที่เหมาะสมกับบริบท
- ใช้ `format="relative"` สำหรับเวลาที่ผ่านมา

❌ **อย่าทำ (Don't):**
- ไม่ควร hardcode วันที่เป็นสตริง
- ไม่ควรแสดง timestamp แบบ Unix
- ไม่ควร format วันที่ด้านหลัง JavaScript เท่านั้น

---

## 🔧 Troubleshooting

### ปัญหา: วันที่แสดงผิด
```typescript
// ❌ ผิด - String format ไม่ถูก
<FormattedDate date="10/02/2026" />

// ✅ ถูก - ISO format
<FormattedDate date="2026-02-10T14:30:00.000Z" />

// ✅ ถูก - Date object
<FormattedDate date={new Date()} />
```

### ปัญหา: Relative time ไม่อัปเดต
```typescript
// ❌ ผิด - render once
<FormattedDate date={createdAt} format="relative" />

// ✅ ถูก - สามารถใช้ effect เพื่อ re-render
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 60000); // Update every minute

  return () => clearInterval(interval);
}, []);
```

---

## 📚 อ้างอิง

- [Date Utility Functions](../frontend/src/utils/dateUtils.ts)
- [FormattedDate Component](../frontend/src/components/FormattedDate.tsx)
- [Example Components](../frontend/src/components/ExampleDataDisplays.tsx)
- [Backend Routes](../backend/src/routes/)

---

**Updated**: February 2026
**Version**: 1.0.0
