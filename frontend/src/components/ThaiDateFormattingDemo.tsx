import React from 'react';
import {
  formatDateThai,
  formatDateTimeThaiWithTime,
  formatDateThaiWithDayName,
  formatDateRangeThai,
  formatMonthYearThai,
  formatRelativeTimeThai,
  formatTimeThai,
  gregorianToBuddhist
} from '@/utils/dateUtils';

/**
 * Demo Page showing all Thai Date Formatting Options
 * Access this component to see how formats work
 */
export function ThaiDateFormattingDemo() {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now
  const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);   // 2 days ago

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Thai Date Formatting Demo
        </h1>
        <p className="text-gray-600 mb-8">
          ตัวอย่างการใช้งาน Date Formatting ในรูปแบบไทย
        </p>

        {/* Format Examples */}
        <div className="space-y-6">
          {/* Default Format */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              1️⃣ Default Format (วันที่ เดือนไทย ปี พ.ศ.)
            </h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-lg text-blue-600 mb-2">
              {formatDateThai(now)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Code:</strong> formatDateThai(date)
            </p>
          </div>

          {/* Date with Time */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              2️⃣ Date with Time (เวลา HH:MM)
            </h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-lg text-green-600 mb-2">
              {formatDateTimeThaiWithTime(now)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Code:</strong> formatDateTimeThaiWithTime(date)
            </p>
          </div>

          {/* Date with Day Name */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              3️⃣ Date with Day Name (วัน ที่ เดือน ปี)
            </h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-lg text-purple-600 mb-2">
              {formatDateThaiWithDayName(now)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Code:</strong> formatDateThaiWithDayName(date)
            </p>
          </div>

          {/* Month Year Only */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              4️⃣ Month & Year Only (เดือน ปี)
            </h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-lg text-orange-600 mb-2">
              {formatMonthYearThai(now)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Code:</strong> formatMonthYearThai(date)
            </p>
          </div>

          {/* Time Only */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              5️⃣ Time Only (HH:MM)
            </h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-lg text-red-600 mb-2">
              {formatTimeThai(now)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Code:</strong> formatTimeThai(date)
            </p>
          </div>

          {/* Time with Seconds */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-cyan-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              6️⃣ Time with Seconds (HH:MM:SS)
            </h2>
            <div className="bg-gray-50 p-4 rounded font-mono text-lg text-cyan-600 mb-2">
              {formatTimeThai(now, true)}
            </div>
            <p className="text-sm text-gray-600">
              <strong>Code:</strong> formatTimeThai(date, true)
            </p>
          </div>

          {/* Relative Time */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              7️⃣ Relative Time (เมื่อ ... ที่แล้ว)
            </h2>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600">ปัจจุบัน: </span>
                <span className="font-mono text-indigo-600">
                  {formatRelativeTimeThai(now)}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600">2 วันที่แล้ว: </span>
                <span className="font-mono text-indigo-600">
                  {formatRelativeTimeThai(pastDate)}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600">5 วันต่อไป: </span>
                <span className="font-mono text-indigo-600">
                  {formatRelativeTimeThai(futureDate)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Code:</strong> formatRelativeTimeThai(date)
            </p>
          </div>

          {/* Date Range */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              8️⃣ Date Range (10 - 20 เดือน ปี)
            </h2>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600">Same Month: </span>
                <span className="font-mono text-pink-600">
                  {formatDateRangeThai(
                    new Date(2026, 1, 10),
                    new Date(2026, 1, 20)
                  )}
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600">Different Months: </span>
                <span className="font-mono text-pink-600">
                  {formatDateRangeThai(
                    new Date(2026, 0, 25),
                    new Date(2026, 1, 10)
                  )}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Code:</strong> formatDateRangeThai(startDate, endDate)
            </p>
          </div>

          {/* Gregorian to Buddhist */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              9️⃣ Gregorian to Buddhist Year Conversion
            </h2>
            <div className="space-y-2">
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600">2026 (ค.ศ.) = </span>
                <span className="font-mono text-lg font-bold text-teal-600">
                  {gregorianToBuddhist(2026)} (พ.ศ.)
                </span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="text-sm text-gray-600">ปี ปัจจุบัน: </span>
                <span className="font-mono text-teal-600">
                  {now.getFullYear()} = {gregorianToBuddhist(now.getFullYear())}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              <strong>Code:</strong> gregorianToBuddhist(year)
            </p>
          </div>
        </div>

        {/* Month Names Reference */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📅 Thai Month Names Reference
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { num: 1, thai: 'มกราคม', eng: 'January' },
              { num: 2, thai: 'กุมภาพันธ์', eng: 'February' },
              { num: 3, thai: 'มีนาคม', eng: 'March' },
              { num: 4, thai: 'เมษายน', eng: 'April' },
              { num: 5, thai: 'พฤษภาคม', eng: 'May' },
              { num: 6, thai: 'มิถุนายน', eng: 'June' },
              { num: 7, thai: 'กรกฎาคม', eng: 'July' },
              { num: 8, thai: 'สิงหาคม', eng: 'August' },
              { num: 9, thai: 'กันยายน', eng: 'September' },
              { num: 10, thai: 'ตุลาคม', eng: 'October' },
              { num: 11, thai: 'พฤศจิกายน', eng: 'November' },
              { num: 12, thai: 'ธันวาคม', eng: 'December' }
            ].map(m => (
              <div key={m.num} className="p-2 bg-blue-50 rounded border border-blue-200">
                <p className="font-semibold text-blue-600">{m.thai}</p>
                <p className="text-xs text-gray-500">{m.eng}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Day Names Reference */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📆 Thai Day Names Reference
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { thai: 'อาทิตย์', eng: 'Sunday' },
              { thai: 'จันทร์', eng: 'Monday' },
              { thai: 'อังคาร', eng: 'Tuesday' },
              { thai: 'พุธ', eng: 'Wednesday' },
              { thai: 'พฤหัสบดี', eng: 'Thursday' },
              { thai: 'ศุกร์', eng: 'Friday' },
              { thai: 'เสาร์', eng: 'Saturday' }
            ].map((d, i) => (
              <div key={i} className="p-2 bg-green-50 rounded border border-green-200">
                <p className="font-semibold text-green-600">{d.thai}</p>
                <p className="text-xs text-gray-500">{d.eng}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThaiDateFormattingDemo;
