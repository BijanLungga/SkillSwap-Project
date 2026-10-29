import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/api';

export interface AppNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  toast: { title: string; message: string; link?: string | null } | null;
  clearToast: () => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  requestPushPermission: () => Promise<void>;
  pushPermission: string;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{
  currentUser: { id: string; name: string; email: string } | null;
  children: React.ReactNode;
}> = ({ currentUser, children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string; link?: string | null } | null>(null);
  const [pushPermission, setPushPermission] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const fetchNotifications = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [resList, resCount] = await Promise.all([
        getNotifications(currentUser.id),
        getUnreadNotificationCount(currentUser.id),
      ]);
      setNotifications(resList.data.data || []);
      setUnreadCount(resCount.data.data?.unreadCount || 0);
    } catch (err) {
      console.error('Gagal mengambil data notifikasi:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    if (!currentUser) return;
    try {
      await markNotificationAsRead(id, currentUser.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Gagal menandai notifikasi dibaca:', err);
    }
  };

  const markAllRead = async () => {
    if (!currentUser) return;
    try {
      await markAllNotificationsAsRead(currentUser.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Gagal menandai semua dibaca:', err);
    }
  };

  const requestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
    }
  };

  const showPushNotification = (title: string, body: string, link?: string | null) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
        if (link) {
          notif.onclick = () => {
            window.focus();
            window.location.href = link;
          };
        }
      } catch (err) {
        console.error('Push notification error:', err);
      }
    }
  };

  // Initial load when user logged in
  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser, fetchNotifications]);

  // WebSocket Connection
  useEffect(() => {
    if (!currentUser) return;

    let socket: WebSocket | null = null;
    let reconnectTimeout: any = null;
    let isSubscribed = true;

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Connect via Vite proxy or fallback directly to port 5000
        const wsUrl = `${protocol}//${window.location.host}/ws?userId=${currentUser.id}`;
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          socket?.send(
            JSON.stringify({
              type: 'IDENTIFY',
              userId: currentUser.id,
            })
          );
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NOTIFICATION' && data.data) {
              const newNotif: AppNotification = data.data;

              setNotifications((prev) => [newNotif, ...prev]);
              setUnreadCount((prev) => prev + 1);

              // Tampilkan toast di dalam aplikasi
              setToast({
                title: newNotif.title,
                message: newNotif.message,
                link: newNotif.link,
              });

              // Tampilkan Browser Native Push Notification jika diizinkan
              showPushNotification(newNotif.title, newNotif.message, newNotif.link);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };

        socket.onclose = () => {
          if (isSubscribed) {
            reconnectTimeout = setTimeout(connectWebSocket, 5000);
          }
        };

        socket.onerror = () => {
          socket?.close();
        };
      } catch (err) {
        console.error('WebSocket connection failed:', err);
      }
    };

    connectWebSocket();

    // Fallback polling every 30 seconds
    const pollInterval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (socket) {
        socket.close();
      }
    };
  }, [currentUser, fetchNotifications]);

  const clearToast = () => setToast(null);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        toast,
        clearToast,
        fetchNotifications,
        markAsRead,
        markAllRead,
        requestPushPermission,
        pushPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

