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
      
      const user = UserFactory.loadFromJSON(req.body);
      
      if (await user.userExists(user.email)) {
        return res.status(400).json({ error: 'User already exists.' });  
      }

      const { _id, name, email, admin } = (await user.create());
      return res.json({ _id, name, email, admin });

      /*const { _id, name, email, admin } = (await user.create());
      return res.json({ _id, name, email, admin });*/

      /*const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });  
      }

      const { _id, name, email, admin } = (await User.create(req.body));
      return res.json({ _id, name, email, admin });
      */
    } catch (err) {
      // TODO - Trocar console.log() para registro de logs.
      console.log(err);
      return res.status(500).json({ error: 'Internal error' });
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

      const user = await UserFactory.getById(req.body._id);
      
      if (!user) return res.status(400).json({ error: 'User nor found.' });

      const { _id, email, password, new_password } = req.body;

      if (email !== user.email && (await user.userExists(email))) {
        return res.status(400).json({ error: 'Email already exists' });  
      }

      if(new_password && !(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match.' });
      }
      
      await user.update(req.body);

      return res.status(200).json({ message: 'teste ok' });
      /*
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

      const user = new User;
      const { _id, email, password, new_password } = req.body;
      const userExists = await user.findById(_id);

      if (user.email !== email && (await user.findOne({ email: email }))) {
        return res.status(400).json({ error: 'Email already exists' });  
      }
      
      if(new_password && !(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match.' });
      }

      const userToUpdate = await user.loadJSON(req.body);

      console.log('******')
      console.log(userToUpdate)
      console.log('******')
      return res.json({ message: 'teste' });
      const { name, admin } = await user.update(req.body)
      
      return res.json({ _id, name, email, admin });
      */
    } catch (err) {
      console.log('--------------')
      console.log(err)
      console.log('--------------')
      return res.status(err.code).json({ error: err.message });
    }
  }

}

export default new UserController();