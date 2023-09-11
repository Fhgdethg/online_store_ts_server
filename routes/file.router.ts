import { Router } from 'express';

import fileController from '../controllers/file.controller.js';

import authMiddleware from '../middleware/auth.middleware.js';

import { routes } from "../constants/routes.js";

const router = Router();

router.get(routes.root, authMiddleware, fileController.getFiles);
router.post(routes.root, authMiddleware, fileController.createDir);
router.delete(routes.root, authMiddleware, fileController.deleteFile);

router.get(routes.download, authMiddleware, fileController.downloadFile);

router.post(routes.upload, authMiddleware, fileController.uploadFile);

export default router;
