import { Router } from 'express';
import * as DashboardController from '../controllers/DashboardController';

const router = Router();

router.get('/dashboard', DashboardController.getDashboard);

export default router;
