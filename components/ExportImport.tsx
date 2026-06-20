'use client';

import { useRef, useState } from 'react';
import { AppData } from '@/types';
import { useAppData } from '@/components/AppDataProvider';

export function ExportImport() {
  const { data, importData } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `recipe-calculator-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result)) as AppData;
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid file');
        }
        if (!Array.isArray(parsed.ingredients) || !Array.isArray(parsed.recipes)) {
          throw new Error('File is missing ingredients or recipes');
        }
        importData(parsed);
        setMessage('Data imported successfully.');
      } catch (error) {
        setMessage(
          `Import failed: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      } finally {
        setTimeout(() => setMessage(null), 4000);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        className="px-3 py-2 rounded-md text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
      >
        Export
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        className="px-3 py-2 rounded-md text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50"
      >
        Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        onChange={handleFileChange}
        className="hidden"
      />
      {message && (
        <span className="absolute right-4 top-16 bg-slate-900 text-white text-xs px-3 py-2 rounded-md shadow-lg z-40">
          {message}
        </span>
      )}
    </div>
  );
}
