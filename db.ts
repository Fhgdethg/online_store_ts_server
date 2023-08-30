import db from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URL = `${process.env.DB_URL}`;

export const connectDbHandler = async () => await db.connect(DB_URL);

export default db;
