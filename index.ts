import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

import authRouter from './routes/auth.router.js';
import fileRouter from './routes/file.router.js';

import corsMiddleware from './middleware/cors.middleware.js';

import { routes } from "./constants/routes.js";

import { connectDbHandler } from './db.js';

dotenv.config();

const app = express();

app.use(corsMiddleware);
app.use(fileUpload({}));
app.use(express.json());
app.use(`${routes.api}${routes.auth}`, authRouter);
app.use(`${routes.api}${routes.files}`, fileRouter);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDbHandler();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
