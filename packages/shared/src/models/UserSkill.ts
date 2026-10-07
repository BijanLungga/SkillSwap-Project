import { SkillType } from '../enums/SkillType';

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  skillType: SkillType;
  createdAt: Date | string;
}
