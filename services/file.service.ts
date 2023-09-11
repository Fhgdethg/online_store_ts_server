import fs from 'fs/promises';

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
