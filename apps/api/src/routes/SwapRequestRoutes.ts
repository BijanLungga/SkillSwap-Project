import { Router } from 'express';
import * as SwapRequestController from '../controllers/SwapRequestController';

const router = Router();

router.get('/swap-requests', SwapRequestController.getSwapRequests);
router.post('/swap-requests', SwapRequestController.createSwapRequest);
router.put('/swap-requests/:id', SwapRequestController.updateSwapRequest);

export default router;
