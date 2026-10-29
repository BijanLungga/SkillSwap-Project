import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, MessageSquare, ArrowLeftRight, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllRead,
    requestPushPermission,
    pushPermission,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_CHAT_MESSAGE':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'REVIEW_RECEIVED':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <ArrowLeftRight className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full focus:outline-none transition-colors"
        title="Notifikasi"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 sm:w-96 rounded-lg shadow-2xl bg-white border border-gray-200 ring-1 ring-black ring-opacity-5 z-50">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-gray-800">Notifikasi</h3>
              {unreadCount > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} baru
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Tandai semua dibaca
              </button>
            )}
          </div>

          {pushPermission !== 'granted' && (
            <div className="px-3 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
              <span>Aktifkan push browser untuk info instan</span>
              <button
                onClick={requestPushPermission}
                className="px-2 py-1 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700"
              >
                Izinkan
              </button>
            </div>
          )}

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Belum ada pemberitahuan.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3 text-left hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors ${
                    !notif.isRead ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                      {getNotificationIcon(notif.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${!notif.isRead ? 'text-indigo-900' : 'text-gray-900'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-gray-400">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notif.message}</p>
                  </div>
                  {!notif.isRead && (
                    <div className="flex-shrink-0 self-center">
                      <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

