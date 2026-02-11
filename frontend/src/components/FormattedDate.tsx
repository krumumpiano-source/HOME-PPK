import React from 'react';
import {
  formatDateThai,
  formatDateTimeThaiWithTime,
  formatDateThaiWithDayName,
  formatMonthYearThai,
  formatRelativeTimeThai,
  formatTimeThai
} from '../utils/dateUtils';

/**
 * Component to display date in Thai format
 * Default format: "10 กุมภาพันธ์ 2569"
 */
export function FormattedDate({
  date,
  format = 'default',
  className = ''
}: {
  date: Date | string | number;
  format?: 'default' | 'with-time' | 'with-day' | 'month-year' | 'relative' | 'time-only';
  className?: string;
}) {
  const getFormattedDate = () => {
    switch (format) {
      case 'with-time':
        return formatDateTimeThaiWithTime(date);
      case 'with-day':
        return formatDateThaiWithDayName(date);
      case 'month-year':
        return formatMonthYearThai(date);
      case 'relative':
        return formatRelativeTimeThai(date);
      case 'time-only':
        return formatTimeThai(date);
      case 'default':
      default:
        return formatDateThai(date);
    }
  };

  return <span className={className}>{getFormattedDate()}</span>;
}

/**
 * Component to display date range in Thai format
 * Example: "10 - 20 กุมภาพันธ์ 2569"
 */
export function FormattedDateRange({
  startDate,
  endDate,
  className = ''
}: {
  startDate: Date | string | number;
  endDate: Date | string | number;
  className?: string;
}) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return <span className={className}>วันที่ไม่ถูกต้อง</span>;
  }

  const startDay = start.getDate();
  const endDay = end.getDate();
  const month = formatMonthYearThai(end);

  // If different month
  if (start.getMonth() !== end.getMonth()) {
    const startMonth = formatMonthYearThai(start);
    return <span className={className}>{startDay} {startMonth} - {endDay} {month}</span>;
  }

  return <span className={className}>{startDay} - {endDay} {month}</span>;
}

/**
 * Utility hook to format date on demand
 */
export function useDateFormatter() {
  return {
    date: formatDateThai,
    dateTime: formatDateTimeThaiWithTime,
    dateWithDay: formatDateThaiWithDayName,
    monthYear: formatMonthYearThai,
    relativeTime: formatRelativeTimeThai,
    time: formatTimeThai
  };
}

export default FormattedDate;
