/**
 * Thai Date Utilities
 * Format dates in Thai format (DD เดือนเต็มไทย YYYY พ.ศ.)
 */

// Thai month names
const thaiMonths = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม'
];

// Thai day names (optional)
const thaiDays = [
  'อาทิตย์',
  'จันทร์',
  'อังคาร',
  'พุธ',
  'พฤหัสบดี',
  'ศุกร์',
  'เสาร์'
];

/**
 * Convert Gregorian year to Buddhist year (พ.ศ.)
 * @param gregorianYear - Year in Gregorian calendar
 * @returns Buddhist year
 */
export function gregorianToBuddhist(gregorianYear: number): number {
  return gregorianYear + 543;
}

/**
 * Format date to Thai format: "วันที่ เดือนเต็มไทย ปี พ.ศ."
 * Example: "10 กุมภาพันธ์ 2569"
 * 
 * @param date - Date object or date string
 * @returns Formatted Thai date string
 */
export function formatDateThai(date: Date | string | number): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(d.getTime())) {
      return 'วันที่ไม่ถูกต้อง';
    }

    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = gregorianToBuddhist(d.getFullYear());

    return `${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'วันที่ไม่ถูกต้อง';
  }
}

/**
 * Format date with time: "10 กุมภาพันธ์ 2569 เวลา 14:30"
 * 
 * @param date - Date object or date string
 * @param includeSeconds - Include seconds in time
 * @returns Formatted Thai date with time
 */
export function formatDateTimeThaiWithTime(
  date: Date | string | number,
  includeSeconds: boolean = false
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(d.getTime())) {
      return 'วันที่ไม่ถูกต้อง';
    }

    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = gregorianToBuddhist(d.getFullYear());
    
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    const timeStr = includeSeconds 
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;

    return `${day} ${month} ${year} เวลา ${timeStr}`;
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return 'วันที่ไม่ถูกต้อง';
  }
}

/**
 * Format date with day name: "จันทร์ 10 กุมภาพันธ์ 2569"
 * 
 * @param date - Date object or date string
 * @returns Formatted Thai date with day name
 */
export function formatDateThaiWithDayName(date: Date | string | number): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(d.getTime())) {
      return 'วันที่ไม่ถูกต้อง';
    }

    const dayName = thaiDays[d.getDay()];
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = gregorianToBuddhist(d.getFullYear());

    return `${dayName} ${day} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting date with day:', error);
    return 'วันที่ไม่ถูกต้อง';
  }
}

/**
 * Format date range: "10 - 20 กุมภาพันธ์ 2569"
 * 
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted Thai date range
 */
export function formatDateRangeThai(
  startDate: Date | string | number,
  endDate: Date | string | number
): string {
  try {
    const start = typeof startDate === 'string' || typeof startDate === 'number' 
      ? new Date(startDate) 
      : startDate;
    const end = typeof endDate === 'string' || typeof endDate === 'number' 
      ? new Date(endDate) 
      : endDate;

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'วันที่ไม่ถูกต้อง';
    }

    const startDay = start.getDate();
    const endDay = end.getDate();
    const month = thaiMonths[end.getMonth()];
    const year = gregorianToBuddhist(end.getFullYear());

    // If different month
    if (start.getMonth() !== end.getMonth()) {
      const startMonth = thaiMonths[start.getMonth()];
      const startYear = gregorianToBuddhist(start.getFullYear());
      return `${startDay} ${startMonth} ${startYear} - ${endDay} ${month} ${year}`;
    }

    return `${startDay} - ${endDay} ${month} ${year}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return 'วันที่ไม่ถูกต้อง';
  }
}

/**
 * Format only month and year: "กุมภาพันธ์ 2569"
 * 
 * @param date - Date object or date string
 * @returns Formatted Thai month and year
 */
export function formatMonthYearThai(date: Date | string | number): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(d.getTime())) {
      return 'วันที่ไม่ถูกต้อง';
    }

    const month = thaiMonths[d.getMonth()];
    const year = gregorianToBuddhist(d.getFullYear());

    return `${month} ${year}`;
  } catch (error) {
    console.error('Error formatting month and year:', error);
    return 'วันที่ไม่ถูกต้อง';
  }
}

/**
 * Get relative time in Thai: "เมื่อ 2 วันที่แล้ว"
 * 
 * @param date - Date object or date string
 * @returns Relative time string in Thai
 */
export function formatRelativeTimeThai(date: Date | string | number): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(d.getTime())) {
      return 'วันที่ไม่ถูกต้อง';
    }

    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'เมื่อสักครู่';
    } else if (diffMins < 60) {
      return `เมื่อ ${diffMins} นาทีที่แล้ว`;
    } else if (diffHours < 24) {
      return `เมื่อ ${diffHours} ชั่วโมงที่แล้ว`;
    } else if (diffDays < 7) {
      return `เมื่อ ${diffDays} วันที่แล้ว`;
    } else {
      return formatDateThai(d);
    }
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'วันที่ไม่ถูกต้อง';
  }
}

/**
 * Format time only: "14:30" or "14:30:45"
 * 
 * @param date - Date object or date string
 * @param includeSeconds - Include seconds
 * @returns Formatted time string
 */
export function formatTimeThai(
  date: Date | string | number,
  includeSeconds: boolean = false
): string {
  try {
    const d = typeof date === 'string' || typeof date === 'number' 
      ? new Date(date) 
      : date;

    if (isNaN(d.getTime())) {
      return 'เวลาไม่ถูกต้อง';
    }

    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return includeSeconds 
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'เวลาไม่ถูกต้อง';
  }
}

export default {
  formatDateThai,
  formatDateTimeThaiWithTime,
  formatDateThaiWithDayName,
  formatDateRangeThai,
  formatMonthYearThai,
  formatRelativeTimeThai,
  formatTimeThai,
  gregorianToBuddhist,
  thaiMonths,
  thaiDays,
};
