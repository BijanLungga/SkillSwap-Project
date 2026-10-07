import { Request, Response } from 'express';
import * as ExploreService from '../services/ExploreService';

export const exploreUsers = async (req: Request, res: Response) => {
  try {
    const { search, skillType, userId } = req.query;
    const result = await ExploreService.exploreUsers({
      search: search as string,
      skillType: skillType as string,
      userId: userId as string
    });
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
