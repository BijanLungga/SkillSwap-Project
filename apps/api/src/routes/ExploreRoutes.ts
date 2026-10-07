import { Router } from 'express';
import * as ExploreController from '../controllers/ExploreController';

const router = Router();

router.get('/explore', ExploreController.exploreUsers);

export default router;
