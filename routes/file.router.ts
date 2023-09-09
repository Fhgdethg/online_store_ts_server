import { Router } from 'express';

import fileController from '../controllers/file.controller.js';

import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('', authMiddleware, fileController.createDir);
router.post('/upload', authMiddleware, fileController.uploadFile);
router.get('', authMiddleware, fileController.getFiles);
router.get('/download', authMiddleware, fileController.downloadFile);

export default router;
