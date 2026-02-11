import { useState, useEffect } from 'react';

// Fixed type errors for payment properties
interface Payment {
  date: string;
  amount: number;
  status: string;
}

const PaymentHistoryPage = () => {
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch('/api/payments/history');
        if (!response.ok) {
          throw new Error('Failed to fetch payment history');
        }
        const data = await response.json();
        setPaymentHistory(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ประวัติการชำระเงิน</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">วันที่</th>
            <th className="border border-gray-300 px-4 py-2">จำนวนเงิน</th>
            <th className="border border-gray-300 px-4 py-2">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((payment, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{payment.date}</td>
              <td className="border border-gray-300 px-4 py-2">฿{payment.amount}</td>
              <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryPage;