import { PublicUser } from './user.interface';

export interface AuthResponse {
  accessToken: string;
  expiresInSeconds: number;
  user: PublicUser;
}
