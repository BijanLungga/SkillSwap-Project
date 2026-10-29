import { Router } from 'express';
import * as NotificationController from '../controllers/NotificationController';

const router = Router();

router.get('/notifications', NotificationController.getUserNotifications);
router.get('/notifications/unread-count', NotificationController.getUnreadCount);
router.patch('/notifications/read-all', NotificationController.markAllAsRead);
router.patch('/notifications/:id/read', NotificationController.markAsRead);

export default router;

