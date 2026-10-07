import { Router } from 'express';
import * as UserController from '../controllers/UserController';

const router = Router();

router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.register);
router.post('/users/login', UserController.login);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);

export default router;
