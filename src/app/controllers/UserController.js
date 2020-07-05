import * as Yup from 'yup';
import bcrypt from 'bcryptjs';

import User from '../models/User';
import data from '../../config/data';

class UserController {

  // TODO - Criar rota para busca e colocar paginação nas listas de users

  async get(req, res) {
    try {
      const { _id } = req.params;
      if (!(await User.isAdmin(_id))) {
        return res.status(400).json({ message: 'Invalid user id.' });  
      }
      
      const user = await User.findById(_id);

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });  
      }
    
      const { name, email, status, admin } = user;
      return res.json({ _id, name, email, status, admin });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  async getActive(req, res) {
    try {
      const users = await User.find({'status': 'active'}, {'name': 1, 'email':1, 'status':1, 'admin':1});
      return res.json({ users });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  async getAll(req, res) {
    try {
      const users = await User.find({}, {'name': 1, 'email':1, 'status':1, 'admin':1});
      return res.json({ users });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
        status: Yup.string().oneOf(data.userStatus)
      });
      
      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });  
      }

      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });  
      }

      const { _id, name, email, status, admin } = (await User.create(req.body));
      return res.json({ _id, name, email, status, admin });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        old_password: Yup.string(),
        password: Yup.string().min(6).when('old_password', (old_password, field) => old_password ? field.required() : field),
        confirm_password: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field),
        status: Yup.string().oneOf(data.userStatus)
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });
      }

      const { old_password } = req.body;
      const user = await User.findById(req._id);
      
      if (req.body.email && user.email !== email && (await User.findOne({ email }))) {
        return res.status(400).json({ error: 'Email already exists' });  
      }

      if(old_password && !(await bcrypt.compare(old_password, user.password))) {
        return res.status(401).json({ error: 'Password does not match.' });
      }
      if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 8);
      const { _id, name, email, status, admin } = await User.findOneAndUpdate({ _id: req._id }, req.body, { new: true });
      
      return res.json({ _id, name, email, status, admin });
    } catch (err) {
      return res.status(err.code).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {

      const tokenId = req._id;
      const { _id } = req.params;
      
      if (!User.validateMongoId(_id)) {
        return res.status(401).json({ error: 'Invalid user id.' });
      }
      
      if (tokenId !== _id && !(await User.isAdmin(tokenId))) {
        return res.json({ message: 'Permission denied.' });  
      }

      const { name, email, status, admin } = await User.findOneAndUpdate({ _id}, { status: 'deleted' }, { new: true });
      return res.json({ _id, name, email, status, admin });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

}

export default new UserController();