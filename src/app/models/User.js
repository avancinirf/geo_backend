import UserRepository from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { UserException } from '../../Utils';

export class UserFactory {
  static getByObject(userObject) {
    return new User(
      userObject._id,
      userObject.name,
      userObject.email,
      userObject.password,
      userObject.password_hash,
      userObject.admin
    );
  }
  
  static async getByEmail(email) {
    const user = await UserRepository.findOne({ email });
    console.log(user);
    return UserFactory.getByObject(await UserRepository.findOne({ email }));
  }

  static async getById(_id) {
    return UserFactory.getByObject(await UserRepository.findOne({ _id: Types.ObjectId(_id) }));
  }
}

class User {
  constructor(_id = null, name, email, password, password_hash = null, admin = false) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.new_password = password;
    this.password_hash = password_hash;
    this.admin = admin;
  }

  async setPassword_hash(password) {
    this.password = password;
    this.password_hash = await bcrypt.hash(this.password, 8);
  }

  async checkPassword(password) {
    return (await bcrypt.compare(password, this.password_hash));
  }

  async userExists() {
    const teste = !!(await UserRepository.findOne({ email: this.email }));
    return !!(await UserRepository.findOne({ email: this.email }));
  }

  setFields(e) {
    this.name = e.name || this.name;
    this.email = e.email || this.email;
    this.admin = e.admin || this.admin;
  }

  async create() {
    try {
      if((await this.userExists())) {
        throw new UserException('Email already exists.');
      }
      await this.setPassword_hash(this.password);
      return (await UserRepository.create(this.toJSON()));
    } catch (Exception) {
      if (Exception instanceof UserException) {
        throw Exception;  
      }
      throw new UserException('Internal error.', 500);
    }
  }

  async update(fields) {
    try {
      if (this.email !== fields.email && (await userExists())) {
        throw new UserException('Email already exists.');
      }
      this.setFields(fields);
      if (fields.new_password) {
        await this.setPassword_hash(fields.new_password);
      }
      return (await UserRepository.findOneAndUpdate({ _id: Types.ObjectId(this._id) }, this.toJSON(), { new: true }));
    } catch (Exception) {
      if (Exception instanceof UserException) {
        throw Exception;
      }
      console.log("teste",Exception)
      throw new UserException('Internal error.', 500);
    }
  }
  
  toJSON() {
    return {
      name: this.name,
      email: this.email,
      password_hash: this.password_hash,
      admin: this.admin
    };
  }


}

export default User;


/*import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const defaultString = {
  type: String,
  required: true,
  trim: true
};

const UserSchema = new mongoose.Schema({
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

export default mongoose.model('User', UserSchema);*/