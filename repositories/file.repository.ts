import File from '../models/File.js';

import { IUserMinimal } from '../types/userTypes';

class FileRepository {
  async findOneFile(expression: any) {
    return await File.findOne(expression);
  }

  async findByIdAndRemove(expression: any) {
    return await File.findByIdAndRemove(expression);
  }

  async findFiles(expression: any) {
    return await File.find(expression);
  }

  async addFile(fileData: any) {
    const user = new File(fileData);
    await user.save();
    return user;
  }
}

export default new FileRepository();
