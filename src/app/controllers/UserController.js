import { UserFactory } from '../models/User';

class UserController {
  async store(req, res) {
    try {
      const user = UserFactory.getByObject(req.body);
      const { name, email, admin } = (await user.create());
      return res.json({ name, email, admin });
    } catch (err) {
      return res.status(err.code).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const user = UserFactory.getByObject(req.body);
      const { name, email, admin } = (await user.update());
    } catch (err) {
      return res.status(err.code).json({ error: err.message });
    }
    
    return res.json({ name, email, admin });
  }

}

export default new UserController();