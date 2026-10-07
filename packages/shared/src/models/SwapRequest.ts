import { SwapStatus } from '../enums/SwapStatus';
import { User } from './User';
import { UserSkill } from './UserSkill';

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: SwapStatus;
  message?: string | null;
  createdAt: Date | string;
  sender?: User & { skills?: UserSkill[] };
  receiver?: User & { skills?: UserSkill[] };
}
