import { Request, Response } from 'express';
import * as ReviewService from '../services/ReviewService';

export const createReview = async (req: Request, res: Response) => {
  try {
    const { swapRequestId, reviewerId, rating, comment } = req.body;
    if (!swapRequestId || !reviewerId || rating === undefined) {
      return res.status(400).json({
        success: false,
        error: 'swapRequestId, reviewerId, dan rating wajib diisi',
      });
    }

    const review = await ReviewService.createReview({
      swapRequestId,
      reviewerId,
      rating: Number(rating),
      comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const reviews = await ReviewService.getUserReviews(userId);
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserReputation = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const reputation = await ReviewService.getUserReputation(userId);
    res.json({ success: true, data: reputation });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getSwapReviews = async (req: Request, res: Response) => {
  try {
    const { swapRequestId } = req.params;
    const reviews = await ReviewService.getSwapReviews(swapRequestId);
    res.json({ success: true, data: reviews });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
