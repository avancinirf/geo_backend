import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
  img: {
    type: String,
    trim: true,
    default: ''
  },
  password: defaultString,
  admin: { type: Boolean, required: true, default: false }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});


export default mongoose.model('User', UserSchema);
