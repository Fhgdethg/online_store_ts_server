import fs from 'fs/promises';

import File from "../models/File.js";

const FILE_PATH = `${process.env.FILE_PATH}`

class FileService {
  async checkIsFileExist(filePath: string) {
    try {
      await fs.access(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  getPath(file: any): string {
    return `${FILE_PATH}/${file.user}/${file.path}`
  }

  async createDir(file: any) {
    const filePath = `${process.env.FILE_PATH}/${file.user}/${file.path}`;
    try {
      const isFolderExist = await this.checkIsFileExist(filePath);
      if (isFolderExist) return { message: 'File already exist' };
      else {
        await fs.mkdir(filePath);
        return { message: 'File was created' };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async uploadFile(user: any, file: any, parent: any, path: string, reqParent: any) {
    try {
      file.mv(path);

      const type = file.name.split('.').pop();
      let filePath = file.name
      if (parent) {
        filePath = `${parent.path}/${file.name}`
      }
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: filePath,
        parent: parent ? parent._id : reqParent,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      return dbFile;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteFile(file: any) {
    try {
      const path: string = this.getPath(file)

      if (file.type === 'dir') {
        await fs.rmdir(path)
      }
      else {
        await fs.unlink(path)
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export default new FileService();
