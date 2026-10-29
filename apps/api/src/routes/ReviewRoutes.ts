import { Router } from 'express';
import * as ReviewController from '../controllers/ReviewController';

const router = Router();

router.post('/reviews', ReviewController.createReview);
router.get('/users/:userId/reviews', ReviewController.getUserReviews);
router.get('/users/:userId/reputation', ReviewController.getUserReputation);
router.get('/swap-requests/:swapRequestId/reviews', ReviewController.getSwapReviews);

export default router;

