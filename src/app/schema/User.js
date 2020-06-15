import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const defaultString = {
  type: String,
  required: true,
  trim: true
};

const UserSchema = new Schema({
  name: defaultString,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password_hash: defaultString,
  admin: { type: Boolean, required: true, default: false }
}, { timestamps: true });
// TODO - Alterar o nome dos campos: timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
export default mongoose.model('User', UserSchema);
