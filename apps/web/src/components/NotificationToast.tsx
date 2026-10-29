import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationToast() {
  const { toast, clearToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toast, clearToast]);

  if (!toast) return null;

  const handleClick = () => {
    if (toast.link) {
      navigate(toast.link);
    }
    clearToast();
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white border border-indigo-200 rounded-lg shadow-xl p-4 transition-all duration-300 transform translate-y-0">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Bell className="h-4 w-4" />
          </div>
        </div>
        <div className="ml-3 w-0 flex-1 cursor-pointer" onClick={handleClick}>
          <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">{toast.message}</p>
          {toast.link && (
            <p className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-500">
              Lihat selengkapnya &rarr;
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={clearToast}
            className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

