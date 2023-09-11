import { Response } from 'express';

import File from '../models/File.js';

import fileService from '../services/file.service.js';

import userRepository from '../repositories/user.repository.js';

const FILE_PATH = `${process.env.FILE_PATH}`;

class FileController {
  async createDir(req: any, res: Response) {
    try {
      const { email, name, type, parent } = req.body;
      const file: any = new File({
        email,
        name,
        type,
        parent,
        user: req.user.id,
      });
      const parentFile: any = await File.findOne({ _id: parent });
      if (!parentFile) {
        file.path = name;
        await fileService.createDir(file);
      } else {
        file.path = `${parentFile.path}/${file.name}`;
        await fileService.createDir(file);
        parentFile.childs.push(file._id);
        await parentFile.save();
      }
      await file.save();
      return res.json(file);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }

  async getFiles(req: any, res: Response) {
    try {
      const files = await File.find({
        user: req.user.id,
        parent: req.query.parent,
      });
      return res.json(files);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Can not get files' });
    }
  }

  async uploadFile(req: any, res: Response) {
    try {
      const file = req.files.file;
      file.name = decodeURIComponent(file.name);

      const parent = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
      });
      const user: any = await userRepository.findOneUser({
        _id: req.user.id,
      });

      if (user.usedSpace + file.size > user.diskSpace)
        return res.status(400).json({ message: 'There are no space on disk' });

      user.usedSpace = user.usedSpace + file.size;
      let path: string;

      console.log(file);
      if (parent) path = `${FILE_PATH}/${user._id}/${parent.path}/${file.name}`;
      else path = `${FILE_PATH}/${user._id}/${file.name}`;

      const isFileExist = await fileService.checkIsFileExist(path);

      if (isFileExist) {
        return res.status(400).json({ message: 'File already exist' });
      }

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
        parent: parent ? parent._id : req.body.parent,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      res.json(dbFile);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Upload file error' });
    }
  }

  async downloadFile(req: any, res: Response) {
    try {
      const file: any = await File.findOne({_id: req.query.id, user: req.user.id})
      const path = `${FILE_PATH}/${req.user.id}/${file.path}`
      const isFileExist = await fileService.checkIsFileExist(path);

      console.log(path)
      if (isFileExist) {
        return res.download(path, file.name)
      }

      return res.status(400).json({message: 'Download file error'})
    } catch (err) {
      console.log(err)
      res.status(500).json({message: 'err'})
    }
  }

  async deleteFile(req: any, res: Response) {
    try {
      const file: any = await File.findOne({_id: req.query.id, user: req.user.id})

      if (!file)
        return res.status(400).json({message: 'file not found'})

      fileService.deleteFile(file)

      await File.findByIdAndRemove(file._id)

      return res.json({message: 'file was deleted'})

    } catch (err) {
      console.log(err)
      res.status(400).json({message: 'Dir is not empty'})
    }
  }
}

export default new FileController();
