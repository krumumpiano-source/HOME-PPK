/**
 * API Configuration
 * 
 * Backend runs on Render at: https://home-ppk-backend.onrender.com
 * Local development: http://localhost:3000
 */

export const GAS_API_CONFIG = {
  // Render deployment URL (production)
  PRODUCTION_URL: 'https://home-ppk-backend.onrender.com',
  
  // Local development URL
  DEVELOPMENT_URL: 'http://localhost:3000',
  
  // Use development URL if backend is running locally, otherwise use production
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  
  // API settings
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  
  // Feature flags
  ENABLE_LOGGING: true,
  ENABLE_CACHING: true,
};

/**
 * System Configuration
 */
export const SYSTEM_CONFIG = {
  // Application
  APP_NAME: 'HOME PPK',
  APP_SUBTITLE: 'ระบบจัดการอพยพ',
  VERSION: '1.0.0',
  
  // Default pricing (can be overridden from database)
  DEFAULT_PRICING: {
    WATER_UNIT: 20,      // บาท/หน่วย
    ELECTRIC_UNIT: 7.5,  // บาท/หน่วย
    COMMON_FEE: 500,     // บาท/เดือน
  },
  
  // Payment settings
  PAYMENT: {
    DUE_DAYS: 15,
    LATE_DAYS: 3,
  },
  
  // Pagination
  PAGE_SIZE: 20,
  
  // Languages
  LANGUAGES: ['th', 'en'],
  DEFAULT_LANGUAGE: 'th',
};

/**
 * User Roles
 */
export const ROLES = {
  ADMIN: 'admin',
  WATER_STAFF: 'water_staff',
  ELECTRIC_STAFF: 'electric_staff',
  ACCOUNTANT: 'accountant',
  RESIDENT: 'resident',
  OUTSIDER: 'outsider',
};

/**
 * Status Types
 */
export const STATUS = {
  // Payment status
  UNPAID: 'unpaid',
  PENDING: 'pending',
  VERIFIED: 'verified',
  PAID: 'paid',
  
  // Request status
  ACKNOWLEDGED: 'acknowledged',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
  
  // User status
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive',
};

/**
 * Messages (Thai)
 */
export const MESSAGES = {
  SUCCESS: 'สำเร็จเรียบร้อย',
  ERROR: 'เกิดข้อผิดพลาด',
  LOADING: 'กำลังโหลด...',
  SAVING: 'กำลังบันทึก...',
  DELETING: 'กำลังลบ...',
  CONFIRM_DELETE: 'คุณแน่ใจหรือว่าต้องการลบข้อมูลนี้?',
};
