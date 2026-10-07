import { Request, Response } from 'express';
import * as DashboardService from '../services/DashboardService';

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId wajib disertakan' });
    }
    const dashboard = await DashboardService.getDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
