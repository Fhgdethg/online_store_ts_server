import db from '../db.js';

const { Schema, model, Types } = db;

const defaultDiskSpace = 1024 ** 3 * 10

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  diskSpace: { type: Number, default: defaultDiskSpace },
  usedSpace: { type: Number, default: 0 },
  photo: { type: String },
  files: [{ type: Types.ObjectId, ref: 'File' }],
});

export default model('User', User);
