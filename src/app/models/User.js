import UserRepository from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import { UserException } from '../../Utils';

export class UserFactory {
  static getByObject(userObject) {
    return new User(
      userObject.name,
      userObject.email,
      userObject.password,
      userObject.password_hash,
      userObject.admin
    );
  }
  
  static async getByEmail(email) {
    return UserFactory.getByUserObject(await userRepository.getUserByEmail(email));
  }
}

class User {
  constructor(name, email, password, password_hash = null, admin) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.new_password = password;
    this.password_hash = password_hash;
    this.admin = admin;
  }

  async setPassword_hash() {
    this.password_hash = await bcrypt.hash(this.password, 8);
  }

  async checkPassword(password, password_hash) {
    return (await bcrypt.compare(password, password_hash));
  }

  async create() {
    try {
      if((await this.userExists())) {
        throw new UserException('Email already exists.');
      }
      await this.setPassword_hash();
      const resultado = (await UserRepository.create(this.toJSON()));
      return resultado;
      return (await UserRepository.create(this.toJSON()));
    } catch (Exception) {
      if (Exception instanceof UserException) {
        throw Exception;  
      }
      throw new UserException('Internal error.', 500);
    }
  }

  async update() {
    try {
      const user = await UserRepository.findOne({ email: this.email });
      if (!user) {
        throw new UserException('User not exists.');
      }
      if (!(await this.checkPassword(password, user.password_hash))) {
        throw new UserException('Password does not match.');
      }
      await this.setPassword_hash();
      return (await UserRepository.findOneAndUpdate({ email: this.email }, this.toJSON()));
    } catch (Exception) {
      if (Exception instanceof UserException) {
        throw Exception;
      }
      throw new UserException('Internal error.', 500);
    }
  }

  async userExists() {
    const teste = !!(await UserRepository.findOne({ email: this.email }));
    return !!(await UserRepository.findOne({ email: this.email }));
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