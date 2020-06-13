import mongoose from 'mongoose';
import UserSchema from '../schema/User';

const toJSON = function toJSON(mongooseModel) {
    try {
        return JSON.parse(JSON.stringify(mongooseModel));
    } catch (Excpetion) {
        return {};
    }
};

UserSchema.statics.updateOrCreate = async function updateOrCreate(user) {
  try {
      //const updated = await this.findOneAndUpdate(user.email, user, {upsert: true, new: true, fields: {__v: 0}});
      //return toJSON(updated);
    return true;
  } catch (Exception) {
    throw Exception;
  }
};

export default mongoose.model('users', UserSchema);