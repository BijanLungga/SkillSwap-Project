import { User } from './User';

export interface ChatMessage {
  id: string;
  swapRequestId: string;
  senderId: string;
  messageText: string;
  createdAt: Date | string;
  sender?: User;
}
