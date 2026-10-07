import { Router } from 'express';
import * as ChatController from '../controllers/ChatController';

const router = Router();

router.get('/swap-requests/:id/messages', ChatController.getMessages);
router.post('/swap-requests/:id/messages', ChatController.sendMessage);

export default router;
