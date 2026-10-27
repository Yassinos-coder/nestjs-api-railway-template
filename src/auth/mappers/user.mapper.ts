import { PublicUser, User } from '../interfaces/user.interface';

export class UserMapper {
  static toPublic(user: User): PublicUser {
    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}
