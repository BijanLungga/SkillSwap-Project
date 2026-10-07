import React from 'react';

interface StatusBadgeProps {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    PENDING: { label: 'Menunggu', classes: 'bg-yellow-100 text-yellow-800' },
    ACCEPTED: { label: 'Disetujui', classes: 'bg-green-100 text-green-800' },
    REJECTED: { label: 'Ditolak', classes: 'bg-red-100 text-red-800' },
    COMPLETED: { label: 'Selesai', classes: 'bg-gray-100 text-gray-800' },
  };

  const { label, classes } = config[status] || config.PENDING;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
