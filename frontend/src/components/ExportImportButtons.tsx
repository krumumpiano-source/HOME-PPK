// ExportImportButtons component
import React from 'react';
import { exportData, importData } from '../services/api';

const ExportImportButtons: React.FC = () => {
  const handleExport = async () => {
    try {
      const data = await exportData();
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.json');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importData(file);
        alert('Import successful');
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={handleExport} className="bg-blue-500 text-white p-2 rounded">Export Data</button>
      <input
        type="file"
        onChange={handleImport}
        className="ml-4 border p-2 rounded"
      />
    </div>
  );
};

export default ExportImportButtons;