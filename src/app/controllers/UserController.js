import * as Yup from 'yup';

import { UserFactory } from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6)
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });  
      }

      const user = UserFactory.getByObject(req.body);
      const { _id, name, email, admin } = (await user.create());
      return res.json({ _id, name, email, admin });
    } catch (err) {
      return res.status(err.code).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        new_password: Yup.string().min(6),
        password: Yup.string().min(6).when('new_password', (new_password, field) => new_password ? field.required() : field),
        confirm_password: Yup.string().when('new_password', (new_password, field) => new_password ? field.required().oneOf([Yup.ref('new_password')]) : field),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });  
      }

      const { _id, email, password, new_password } = req.body;
      const user = await UserFactory.getById(_id);
    
      if(new_password && !(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match.' });
      }
      
      const { name, admin } = await user.update(req.body)
  
      return res.json({ _id, name, email, admin });

    } catch (err) {
      return res.status(err.code).json({ error: err.message });
    }
  }

}

export default new UserController();