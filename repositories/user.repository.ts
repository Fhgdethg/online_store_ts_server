import User from '../models/User.js';

import { IUserMinimal } from '../types/userTypes';

class UserRepository {
  async findOneUser(expression: any) {
    return await User.findOne(expression);
  }

  async addUser(userData: IUserMinimal) {
    const user = new User(userData);
    await user.save();
    return user;
  }
}

export default new UserRepository();
