# How to Implement i18n in Existing Components

## Quick Start Guide: Converting Components to Bilingual

This guide shows you how to convert any existing component to support Thai/English translations.

---

## Step 1: Import Translation Hook

At the top of your component file:

```tsx
import { useTranslation } from 'react-i18next';
```

---

## Step 2: Initialize Hook in Component

Inside your component function:

```tsx
export function MyComponent() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);

  // Rest of component...
}
```

---

## Step 3: Replace Hardcoded Text

### Before (Hardcoded Text)
```tsx
<div>
  <h1>Bills</h1>
  <button>Create Bill</button>
  <p>Month: </p>
  <span>Paid</span>
</div>
```

### After (With i18n)
```tsx
<div>
  <h1>{t('bills.title')}</h1>
  <button>{t('bills.create')}</button>
  <p>{t('bills.month')}: </p>
  <span>{t('bills.paid')}</span>
</div>
```

---

## Complete Example: Bills Component

### Original Component (Hardcoded Thai)
```tsx
import React, { useState } from 'react';

export function BillsPage() {
  const [bills] = useState([
    { id: 1, month: 'January', amount: 5000, status: 'paid' },
    { id: 2, month: 'February', amount: 5500, status: 'pending' },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">ใบแจ้งหนี้</h1>
      
      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
        สร้างใบแจ้งหนี้
      </button>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">เดือน</th>
            <th className="p-2">จำนวนเงิน</th>
            <th className="p-2">สถานะ</th>
            <th className="p-2">การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td className="p-2">{bill.month}</td>
              <td className="p-2">฿{bill.amount}</td>
              <td className="p-2">
                {bill.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
              </td>
              <td className="p-2 space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded">
                  แก้ไข
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded">
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bills.length === 0 && (
        <p className="text-center text-gray-500 mt-4">ไม่มีข้อมูล</p>
      )}
    </div>
  );
}
```

### Modified Component (With i18n)
```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function BillsPage() {
  const { t } = useTranslation();
  const [bills] = useState([
    { id: 1, month: 'January', amount: 5000, status: 'paid' },
    { id: 2, month: 'February', amount: 5500, status: 'pending' },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t('bills.title')}</h1>
      
      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded">
        {t('bills.create')}
      </button>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">{t('bills.month')}</th>
            <th className="p-2">{t('bills.total')}</th>
            <th className="p-2">{t('bills.status')}</th>
            <th className="p-2">{t('common.action')}</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td className="p-2">{bill.month}</td>
              <td className="p-2">฿{bill.amount}</td>
              <td className="p-2">
                {t(`bills.${bill.status}`)}
              </td>
              <td className="p-2 space-x-2">
                <button className="px-3 py-1 bg-blue-500 text-white rounded">
                  {t('common.edit')}
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded">
                  {t('common.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {bills.length === 0 && (
        <p className="text-center text-gray-500 mt-4">{t('messages.noData')}</p>
      )}
    </div>
  );
}
```

---

## Example 2: Payment Form Component

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function PaymentForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    amount: '',
    billId: '',
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.amount) {
      newErrors.amount = t('forms.required');
    }
    if (!formData.billId) {
      newErrors.billId = t('forms.required');
    }

    setErrors(newErrors);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">{t('payments.upload')}</h2>

      <div className="space-y-4">
        {/* Amount Field */}
        <div>
          <label className="block font-medium mb-2">
            {t('payments.amount')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className={`w-full p-2 border rounded ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={t('forms.required')}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Bill Selection */}
        <div>
          <label className="block font-medium mb-2">
            {t('payments.billId')} <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.billId}
            onChange={(e) => setFormData({ ...formData, billId: e.target.value })}
            className={`w-full p-2 border rounded ${
              errors.billId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">-- {t('common.select')} --</option>
            <option value="1">January 2024</option>
            <option value="2">February 2024</option>
          </select>
          {errors.billId && (
            <p className="text-red-500 text-sm mt-1">{errors.billId}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-2">
            {t('payments.image')}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('common.save')}
          </button>
          <button
            type="reset"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </form>
  );
}
```

---

## Example 3: Utility Readings Component

```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function UtilityReadings() {
  const { t } = useTranslation();
  const [readings, setReadings] = useState({
    waterCurrent: '',
    waterPrevious: '1000',
    electricCurrent: '',
    electricPrevious: '5500',
  });

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">{t('utilities.title')}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Reading */}
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span>💧</span>
            {t('utilities.waterReading')}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('utilities.previousReading')}
              </label>
              <input
                type="number"
                value={readings.waterPrevious}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('utilities.currentReading')}
              </label>
              <input
                type="number"
                value={readings.waterCurrent}
                onChange={(e) => setReadings({ ...readings, waterCurrent: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t('utilities.unit')}
              />
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              {t('utilities.unit')}: {readings.waterCurrent && 
                (parseInt(readings.waterCurrent) - parseInt(readings.waterPrevious))} ม³
            </div>
          </div>
        </div>

        {/* Electric Reading */}
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <span>⚡</span>
            {t('utilities.electricReading')}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('utilities.previousReading')}
              </label>
              <input
                type="number"
                value={readings.electricPrevious}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t('utilities.currentReading')}
              </label>
              <input
                type="number"
                value={readings.electricCurrent}
                onChange={(e) => setReadings({ ...readings, electricCurrent: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t('utilities.unit')}
              />
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              {t('utilities.unit')}: {readings.electricCurrent && 
                (parseInt(readings.electricCurrent) - parseInt(readings.electricPrevious))} kWh
            </div>
          </div>
        </div>
      </div>

      <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full">
        {t('utilities.submit')}
      </button>
    </div>
  );
}
```

---

## Common Translation Key Patterns

### UI Elements
```tsx
t('common.save')      // "Save" / "บันทึก"
t('common.delete')    // "Delete" / "ลบ"
t('common.edit')      // "Edit" / "แก้ไข"
t('common.cancel')    // "Cancel" / "ยกเลิก"
t('common.close')     // "Close" / "ปิด"
```

### Status Messages
```tsx
t('bills.paid')       // "Paid" / "ชำระแล้ว"
t('bills.pending')    // "Pending" / "รอชำระ"
t('bills.overdue')    // "Overdue" / "ค้างชำระ"
t('payments.approved')// "Approved" / "อนุมัติแล้ว"
t('payments.rejected')// "Rejected" / "ปฏิเสธ"
```

### Form Labels
```tsx
t('common.email')     // "Email" / "อีเมล"
t('common.password')  // "Password" / "รหัสผ่าน"
t('bills.month')      // "Month" / "เดือน"
t('bills.year')       // "Year" / "ปี"
```

### Error/Success Messages
```tsx
t('messages.saveSuccess')    // "Saved successfully" / "บันทึกสำเร็จ"
t('messages.deleteFailed')   // "Failed to delete" / "ลบล้มเหลว"
t('errors.serverError')      // "Server Error" / "ข้อผิดพลาดของเซิร์ฟเวอร์"
t('forms.required')          // "This field is required" / "กรุณากรอกข้อมูลนี้"
```

---

## Checklist for Component Migration

- [ ] Import `useTranslation` hook
- [ ] Initialize with `const { t } = useTranslation()`
- [ ] Replace all hardcoded UI text with `t('key')`
- [ ] Replace all label text with `t('key')`
- [ ] Replace all button text with `t('key')`
- [ ] Replace all error messages with `t('key')`
- [ ] Replace all placeholder text with `t('key')`
- [ ] Replace all status text with `t('key')`
- [ ] Test component in Thai
- [ ] Test component in English
- [ ] Verify layout doesn't break with longer text
- [ ] Check for truncated labels

---

## Testing Your Bilingual Component

### Manual Testing Steps

1. **Thai Language Test**
   - Switch to Thai (default)
   - All text should display in Thai
   - Form validation messages in Thai
   - Error messages in Thai

2. **English Language Test**
   - Switch to English
   - All text should display in English
   - Form validation messages in English
   - Error messages in English

3. **Persistence Test**
   - Select English
   - Reload page
   - Should stay in English
   - Check localStorage for `i18nextLng: 'en'`

4. **Layout Test**
   - English text is typically longer
   - Check for label overflow
   - Verify buttons don't break
   - Test on mobile (320px width)

---

## Troubleshooting

### Problem: Key shows as `bills.title` instead of translated text
**Solution**: 
- Check key exists in both JSON files
- Check spelling (Thai translations use lowercase)
- Verify JSON syntax is valid

### Problem: Component doesn't update when language changes
**Solution**:
- Ensure `useTranslation()` is called in the component
- Check that component is not in a memo without i18n dependency

### Problem: Text is truncated or overflows
**Solution**:
- Use Tailwind's `truncate` or `line-clamp`
- Increase button width
- Use responsive text sizes

---

## Best Practices

1. **Always use hooks**: Never use i18n outside of components
2. **Consistent key naming**: Use dot notation, lowercase
3. **Keep keys organized**: Group by feature (bills.*, payments.*, etc.)
4. **Test both languages**: Always switch and verify
5. **Plan for text length**: English is typically 30% longer
6. **Use semantic HTML**: Proper labels improve accessibility

---

## Next: Full Component List to Update

Priority order:
1. ✅ App.tsx - DONE
2. ⏳ Bills management
3. ⏳ Payment management
4. ⏳ Utilities (water/electric)
5. ⏳ Request management
6. ⏳ User management
7. ⏳ Admin features
8. ⏳ Settings/Profile

---

**Ready to convert your components?** Start with the examples above and follow the pattern!
