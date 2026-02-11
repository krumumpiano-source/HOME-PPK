import React from 'react';
import { FormattedDate } from './FormattedDate';

/**
 * Example Table Component displaying data with Thai date formatting
 * 
 * Shows how to use FormattedDate component in table rows
 */
export function UserListTable({ users = [] }) {
  if (users.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        ไม่พบข้อมูลผู้ใช้
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ชื่อ</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">อีเมล</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">บทบาท</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">วันที่สร้าง</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">อัปเดต</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-3 text-sm text-gray-800">{user.name}</td>
              <td className="px-6 py-3 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-3 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-gray-600">
                <FormattedDate 
                  date={user.createdAt} 
                  format="with-time"
                  className="text-xs"
                />
              </td>
              <td className="px-6 py-3 text-sm text-gray-600">
                <FormattedDate 
                  date={user.updatedAt} 
                  format="relative"
                  className="text-xs"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Example Bill Card Component
 */
export function BillCard({ bill }: { bill: any }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">
            งวดเดือน <FormattedDate date={new Date(bill.year, bill.month - 1)} format="month-year" />
          </h3>
          <p className="text-sm text-gray-500">
            วันที่สร้าง: <FormattedDate date={bill.createdAt} />
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          bill.status === 'paid' ? 'bg-green-100 text-green-800' :
          bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {bill.status === 'paid' ? 'ชำระแล้ว' :
           bill.status === 'pending' ? 'รอชำระ' : 'ค้างชำระ'}
        </span>
      </div>
      
      <div className="border-t pt-3 mt-3">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <p className="text-gray-500">น้ำ</p>
            <p className="font-semibold">{bill.waterCost} บาท</p>
          </div>
          <div>
            <p className="text-gray-500">ไฟฟ้า</p>
            <p className="font-semibold">{bill.electricCost} บาท</p>
          </div>
          <div>
            <p className="text-gray-500">ค่าส่วนร่วม</p>
            <p className="font-semibold">{bill.commonFee} บาท</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-3 mt-3 text-right">
        <p className="text-gray-500 text-sm">รวม</p>
        <p className="text-2xl font-bold text-blue-600">{bill.total} บาท</p>
      </div>
    </div>
  );
}

/**
 * Example Request Item Component
 */
export function RequestItem({ request }: { request: any }) {
  const statusColors = {
    pending: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'text-yellow-700', label: 'รอดำเนิน' },
    approved: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', label: 'อนุมัติแล้ว' },
    rejected: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', label: 'ปฏิเสธ' },
    completed: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', label: 'เรียบร้อย' }
  };

  const status = statusColors[request.status as keyof typeof statusColors] || statusColors.pending;

  return (
    <div className={`${status.bg} border-l-4 ${status.border} p-4 rounded mb-3`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className={`font-semibold ${status.text}`}>{request.type}</h4>
          <p className="text-sm text-gray-600 mt-1">{request.details}</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${status.text} bg-white border ${status.border}`}>
          {status.label}
        </span>
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        ส่งเมื่อ: <FormattedDate date={request.createdAt} format="with-time" />
      </div>
    </div>
  );
}

/**
 * Example Transaction History
 */
export function TransactionHistory({ transactions = [] }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        ไม่มีรายการทำรายการ
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
              tx.type === 'in' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {tx.type === 'in' ? '✓' : '✕'}
            </div>
            <div>
              <p className="font-medium text-gray-800">{tx.description}</p>
              <p className="text-xs text-gray-500">
                <FormattedDate date={tx.createdAt} format="relative" />
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
              {tx.type === 'in' ? '+' : '-'}{tx.amount} บาท
            </p>
            <p className="text-xs text-gray-500">
              <FormattedDate date={tx.createdAt} format="default" />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default {
  UserListTable,
  BillCard,
  RequestItem,
  TransactionHistory
};
