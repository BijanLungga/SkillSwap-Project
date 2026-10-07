import { User } from '../models/User';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}
