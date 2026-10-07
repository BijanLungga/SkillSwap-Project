import { UserSkill } from '../models/UserSkill';

export interface ExploreUser {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  skillsHave: UserSkill[];
  skillsWant: UserSkill[];
}

export interface ExploreResponse {
  users: ExploreUser[];
  total: number;
}
