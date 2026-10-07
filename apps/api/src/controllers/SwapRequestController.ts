import { Request, Response } from 'express';
import * as SwapRequestService from '../services/SwapRequestService';

export const getSwapRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId wajib disertakan' });
    }
    const requests = await SwapRequestService.getSwapRequests(userId);
    res.json({ success: true, data: requests });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createSwapRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId) {
      return res.status(400).json({ success: false, error: 'senderId dan receiverId wajib diisi' });
    }
    const request = await SwapRequestService.createSwapRequest(senderId, receiverId, message);
    res.json({ success: true, data: request });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateSwapRequest = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'status wajib diisi' });
    }
    const request = await SwapRequestService.updateSwapRequestStatus(req.params.id, status);
    res.json({ success: true, data: request });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
