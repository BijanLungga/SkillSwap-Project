import { Request, Response } from 'express';
import * as NotificationService from '../services/NotificationService';

export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req.query.userId as string) || (req.params.userId as string);
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId wajib disertakan' });
    }
    const notifications = await NotificationService.getUserNotifications(userId);
    res.json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId wajib disertakan' });
    }
    const count = await NotificationService.getUnreadCount(userId);
    res.json({ success: true, data: { unreadCount: count } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId wajib disertakan' });
    }
    const updated = await NotificationService.markAsRead(id, userId);
    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId wajib disertakan' });
    }
    const result = await NotificationService.markAllAsRead(userId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
