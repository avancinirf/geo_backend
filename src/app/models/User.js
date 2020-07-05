import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

const defaultString = { type: String, required: true, trim: true };
const fileSchema = new Schema({ name: defaultString, path: defaultString });
const geometrySchema = new Schema({ name: defaultString, path: defaultString });

const UserSchema = new Schema({
  name: defaultString,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  img: fileSchema,
  geometries: [geometrySchema],
  password: defaultString,
  status: { type: String, required: true, default: 'pending' },
  admin: { type: Boolean, required: true, default: false }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

UserSchema.static('validateMongoId', function(_id) {
  return (new RegExp(/^[a-fA-F0-9]{24}$/).test(_id));
});

UserSchema.static('isAdmin', function(_id) {
  return (this.findOne({ _id, admin: true, status: 'active' }));
});


export default mongoose.model('User', UserSchema);
