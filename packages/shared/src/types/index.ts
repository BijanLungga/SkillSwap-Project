export type SkillType = 'HAVE' | 'WANT';

export type SwapStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  createdAt: Date | string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  skillType: SkillType;
  createdAt: Date | string;
}

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: SwapStatus;
  message?: string | null;
  createdAt: Date | string;
}

export interface ChatMessage {
  id: string;
  swapRequestId: string;
  senderId: string;
  messageText: string;
  createdAt: Date | string;
}

export type NotificationType =
  | 'SWAP_REQUEST_RECEIVED'
  | 'SWAP_REQUEST_ACCEPTED'
  | 'SWAP_REQUEST_REJECTED'
  | 'SWAP_REQUEST_COMPLETED'
  | 'NEW_CHAT_MESSAGE'
  | 'REVIEW_RECEIVED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

export interface Review {
  id: string;
  swapRequestId: string;
  reviewerId: string;
  targetUserId: string;
  rating: number;
  comment?: string | null;
  createdAt: Date | string;
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface UserReputation {
  averageRating: number;
  totalReviews: number;
}


