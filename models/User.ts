import db from '../db.js';

const { Schema, model, Types } = db;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  diskSpace: { type: Number, default: 1024 ** 3 * 10 },
  usedSpace: { type: Number, default: 0 },
  photo: { type: String },
  files: [{ type: Types.ObjectId, ref: 'File' }],
});

export default model('User', User);
