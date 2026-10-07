import { Router } from 'express';
import * as SkillController from '../controllers/SkillController';

const router = Router();

router.get('/users/:id/skills', SkillController.getUserSkills);
router.post('/users/:id/skills', SkillController.addSkill);
router.delete('/skills/:id', SkillController.deleteSkill);

export default router;
