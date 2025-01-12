import { User } from './user';

export class UserFactory {
  static createAuthor(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    };
  }
}
