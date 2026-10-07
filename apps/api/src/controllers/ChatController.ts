import { Request, Response } from 'express';
import * as ChatService from '../services/ChatService';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ChatService.getMessages(req.params.id);
    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, messageText } = req.body;
    if (!senderId || !messageText) {
      return res.status(400).json({ success: false, error: 'senderId dan messageText wajib diisi' });
    }
    const message = await ChatService.sendMessage(req.params.id, senderId, messageText);
    res.json({ success: true, data: message });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
