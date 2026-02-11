import React, { useState, useEffect } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const SendSlipPage = () => {
  const [currentBill, setCurrentBill] = useState<number | null>(null);
  const [previousDue, setPreviousDue] = useState<number | null>(null);
  const [slipImage, setSlipImage] = useState<File | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bills/current');
        const data = await response.json();
        setCurrentBill(data.currentBill);
        setPreviousDue(data.previousDue);
      } catch (error) {
        console.error('Error fetching bill data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSlipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSlipImage(file);
    } else {
      alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
    }
  };

  const handleSubmit = async () => {
    if (!slipImage || !paymentAmount) {
      alert('กรุณาแนบสลิปและระบุยอดเงินที่ชำระ');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('slip', slipImage);
    formData.append('amount', paymentAmount);

    try {
      const response = await fetch('/api/slips/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setStatus('รอตรวจสอบ');
        alert('ส่งสลิปเรียบร้อยแล้ว');
      } else {
        alert('เกิดข้อผิดพลาดในการส่งสลิป');
      }
    } catch (error) {
      console.error('Error uploading slip:', error);
      alert('เกิดข้อผิดพลาดในการส่งสลิป');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ส่งสลิปการชำระเงิน</h1>

      {currentBill !== null && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">ยอดที่ต้องชำระในรอบปัจจุบัน: ฿{currentBill}</h2>
          {previousDue !== null && previousDue > 0 && (
            <p className="text-red-500">ยอดค้างชำระจากเดือนก่อน: ฿{previousDue}</p>
          )}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">แนบสลิปการโอนเงิน</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleSlipUpload}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ยอดเงินที่ชำระ</label>
        <input
          type="text"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value.replace(/[^0-9.]/g, ''))}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="กรอกยอดเงินที่ชำระ"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <AiOutlineLoading3Quarters style={{ animation: 'spin 1s linear infinite' }} className="mr-2" /> กำลังส่ง...
          </>
        ) : (
          'ส่งสลิป'
        )}
      </button>

      {status && (
        <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>สถานะ: {status}</p>
        </div>
      )}
    </div>
  );
};

export default SendSlipPage;