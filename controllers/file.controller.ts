import { Request, Response } from 'express';
import fs from 'fs/promises';

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
      console.log(file);

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

      if (parent) path = `${FILE_PATH}/${user._id}/${parent.path}/${file.name}`;
      else path = `${FILE_PATH}/${user._id}/${file.name}`;

      const isFileExist = await fileService.checkIsFileExist(path);

      if (isFileExist) {
        return res.status(400).json({ message: 'File already exist' });
      }

      file.mv(path);

      const type = file.name.split('.').pop();
      const dbFile = new File({
        name: file.name,
        type,
        size: file.size,
        path: parent?.path,
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
}

export default new FileController();