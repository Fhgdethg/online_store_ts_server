import fs from 'fs/promises';

class FileService {
  async checkIsFileExist(filePath: string) {
    try {
      await fs.access(filePath);
      return true;
    } catch (err) {
      return false;
    }
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
}

export default new FileService();
