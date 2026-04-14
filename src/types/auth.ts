export type AppRole = 'STAFF' | 'USER';

export interface UserProfile {
  uid: string;
  email: string;
  role: AppRole;
  displayName?: string;
  points: number;
  createdAt?: number;
  updatedAt?: number;
  fcmTokens?: string[];
}

export interface RegisterUserInput {
  email: string;
  password: string;
  role: AppRole;
  displayName?: string;
}
