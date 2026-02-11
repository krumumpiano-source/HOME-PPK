// Added Notification component for better UX
import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 text-white rounded shadow-lg ${getBackgroundColor()}`}
    >
      {message}
    </div>
  );
};

export default Notification;