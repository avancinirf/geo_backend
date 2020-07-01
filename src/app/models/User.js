import UserModel from '../schema/User';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

export class UserFactory {
  static loadFromJSON(json) {
    const user = new User();
    user.loadJSON(json);
    return user;  
  }
  
  static async getById(_id) {
    const userAsJson = await UserModel.findById(_id);
    if (!userAsJson) return userAsJson;
    return new User().loadJSON(userAsJson);
  }

  static async getByEmail(email) {
    const userAsJson = await UserModel.findOne({ email });
    if (!userAsJson) return userAsJson;
    return new User().loadJSON(userAsJson);
  }

  static async getEmptyUser() {
    return new User();
  }
}

class User {
  constructor() {
  }

  async checkPassword(password) {
    return (await bcrypt.compare(password, this.password));
  }

  async findOne(obj) {
    return await UserModel.findOne(obj);
  }

  loadJSON(json) {
    this.setUser(this.cleanUpJSON(json));
    return this;
  }

  setUser(json) {
    for (const key in this) {
      delete this[key];
    }
    for (const key in json) {
      if (json[key]) {
        this[key] = json[key];
      }
    }
  }

  cleanUpJSON(json) {
    return {
      _id: json._id || null,
      name: json.name || null,
      email: json.email || null,
      img: json.img || null,
      password: json.password || null,
      admin: json.admin || null
    };
  }

  async create() {
    return await UserModel.create(this);
  }
  
  async update(fields) {
    await this.updateFields(fields);
    return (await UserModel.findOneAndUpdate({ _id: Types.ObjectId(this._id) }, this, { new: true }));
  }

  async userExists(email) {
    return !!(await UserModel.findOne({ email }));
  }

  async updateFields(fields) {
    for (const key in fields) {
      if (key == 'password' || key == '_id') continue;
      if (key == 'new_password') {
        this.password = await bcrypt.hash(fields[key], 8);
        continue;
      }
      this[key] = fields[key];
    }
  }

  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      img: this.img,
      password: this.password,
      admin: this.admin
    };
  }

  toPublicJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      img: this.img,
      admin: this.admin
    };
  }

}

export default User;
