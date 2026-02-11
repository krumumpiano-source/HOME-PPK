/**
 * API Client for HOME PPK Backend
 * This service handles all communication with Node.js/Express backend running on Render
 */

// Configuration - Render deployment URL
export const GAS_CONFIG = {
  DEPLOYMENT_URL: import.meta.env.VITE_API_URL || 'https://home-ppk.onrender.com/api',
  TIMEOUT: 30000,
};

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  timeout?: number;
}

/**
 * Make an API call to Google Apps Script backend
 */
export async function callGasApi<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    data,
    timeout = GAS_CONFIG.TIMEOUT,
  } = options;

  try {
    const url = new URL(`${GAS_CONFIG.DEPLOYMENT_URL}/${endpoint}`);
    
    const requestInit: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    };

    if (data && method !== 'GET') {
      requestInit.body = JSON.stringify(data);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url.toString(), {
      ...requestInit,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return {
      success: false,
      error: error?.message || 'Unknown error occurred',
    };
  }
}

// ============ User APIs ============

export async function authenticateUser(email: string, password: string) {
  return callGasApi('auth/login', {
    method: 'POST',
    data: { email, password },
  });
}

export async function getUserProfile(userId: number) {
  return callGasApi(`users/${userId}`);
}

export async function updateUserProfile(userId: number, profile: any) {
  return callGasApi(`users/${userId}`, {
    method: 'PUT',
    data: profile,
  });
}

export async function getAllUsers() {
  return callGasApi('users');
}

export async function createUser(userData: any) {
  return callGasApi('users', {
    method: 'POST',
    data: userData,
  });
}

export async function deleteUser(userId: number) {
  return callGasApi(`users/${userId}`, {
    method: 'DELETE',
  });
}

// ============ Bill APIs ============

export async function getBills(residentId?: number) {
  const endpoint = residentId ? `bills?residentId=${residentId}` : 'bills';
  return callGasApi(endpoint);
}

export async function getBillById(billId: number) {
  return callGasApi(`bills/${billId}`);
}

export async function createBill(billData: any) {
  return callGasApi('bills', {
    method: 'POST',
    data: billData,
  });
}

export async function updateBill(billId: number, billData: any) {
  return callGasApi(`bills/${billId}`, {
    method: 'PUT',
    data: billData,
  });
}

export async function deleteBill(billId: number) {
  return callGasApi(`bills/${billId}`, {
    method: 'DELETE',
  });
}

// ============ Payment Slip APIs ============

export async function getPaymentSlips(residentId?: number) {
  const endpoint = residentId ? `payment-slips?residentId=${residentId}` : 'payment-slips';
  return callGasApi(endpoint);
}

export async function getPaymentSlipById(slipId: number) {
  return callGasApi(`payment-slips/${slipId}`);
}

export async function createPaymentSlip(slipData: any) {
  return callGasApi('payment-slips', {
    method: 'POST',
    data: slipData,
  });
}

export async function updatePaymentSlip(slipId: number, slipData: any) {
  return callGasApi(`payment-slips/${slipId}`, {
    method: 'PUT',
    data: slipData,
  });
}

export async function verifyPaymentSlip(slipId: number) {
  return callGasApi(`payment-slips/${slipId}/verify`, {
    method: 'PUT',
  });
}

export async function rejectPaymentSlip(slipId: number, reason: string) {
  return callGasApi(`payment-slips/${slipId}/reject`, {
    method: 'PUT',
    data: { reason },
  });
}

// ============ Request APIs ============

export async function getRequests(status?: string) {
  const endpoint = status ? `requests?status=${status}` : 'requests';
  return callGasApi(endpoint);
}

export async function getRequestById(requestId: number) {
  return callGasApi(`requests/${requestId}`);
}

export async function createRequest(requestData: any) {
  return callGasApi('requests', {
    method: 'POST',
    data: requestData,
  });
}

export async function updateRequest(requestId: number, requestData: any) {
  return callGasApi(`requests/${requestId}`, {
    method: 'PUT',
    data: requestData,
  });
}

export async function approveRequest(requestId: number, comments?: string) {
  return callGasApi(`requests/${requestId}/approve`, {
    method: 'PUT',
    data: { comments },
  });
}

export async function rejectRequest(requestId: number, comments?: string) {
  return callGasApi(`requests/${requestId}/reject`, {
    method: 'PUT',
    data: { comments },
  });
}

// ============ Expense APIs ============

export async function getExpenses() {
  return callGasApi('expenses');
}

export async function getExpenseById(expenseId: number) {
  return callGasApi(`expenses/${expenseId}`);
}

export async function createExpense(expenseData: any) {
  return callGasApi('expenses', {
    method: 'POST',
    data: expenseData,
  });
}

export async function updateExpense(expenseId: number, expenseData: any) {
  return callGasApi(`expenses/${expenseId}`, {
    method: 'PUT',
    data: expenseData,
  });
}

export async function approveExpense(expenseId: number) {
  return callGasApi(`expenses/${expenseId}/approve`, {
    method: 'PUT',
  });
}

// ============ Utility Reading APIs ============

export async function getUtilityReadings(month?: string, year?: number) {
  let endpoint = 'utility-readings';
  if (month || year) {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year.toString());
    endpoint += `?${params.toString()}`;
  }
  return callGasApi(endpoint);
}

export async function recordWaterReading(residentId: number, reading: number, month: string) {
  return callGasApi('utility-readings/water', {
    method: 'POST',
    data: { residentId, reading, month },
  });
}

export async function recordElectricReading(residentId: number, reading: number, month: string) {
  return callGasApi('utility-readings/electric', {
    method: 'POST',
    data: { residentId, reading, month },
  });
}

// ============ Statistics APIs ============

export async function getStatistics(period?: string) {
  const endpoint = period ? `statistics?period=${period}` : 'statistics';
  return callGasApi(endpoint);
}

export async function getDashboardData() {
  return callGasApi('statistics/dashboard');
}

export async function getFinancialReport(month: string, year: number) {
  return callGasApi(`statistics/financial?month=${month}&year=${year}`);
}

// ============ Regulation APIs ============

export async function getRegulations() {
  return callGasApi('regulations');
}

export async function getRegulationById(regulationId: number) {
  return callGasApi(`regulations/${regulationId}`);
}

export async function createRegulation(regulationData: any) {
  return callGasApi('regulations', {
    method: 'POST',
    data: regulationData,
  });
}

export async function updateRegulation(regulationId: number, regulationData: any) {
  return callGasApi(`regulations/${regulationId}`, {
    method: 'PUT',
    data: regulationData,
  });
}

export async function deleteRegulation(regulationId: number) {
  return callGasApi(`regulations/${regulationId}`, {
    method: 'DELETE',
  });
}

// ============ Admin APIs ============

export async function getSystemSettings() {
  return callGasApi('admin/settings');
}

export async function updateSystemSettings(settings: any) {
  return callGasApi('admin/settings', {
    method: 'PUT',
    data: settings,
  });
}

export async function generateBills(month: string, year: number) {
  return callGasApi('admin/bills/generate', {
    method: 'POST',
    data: { month, year },
  });
}

export async function sendNotifications(message: string, recipientIds?: number[]) {
  return callGasApi('admin/notifications/send', {
    method: 'POST',
    data: { message, recipientIds },
  });
}

export async function exportDataToFile(dataType: string, format: 'csv' | 'xlsx') {
  return callGasApi(`admin/export/${dataType}?format=${format}`);
}
