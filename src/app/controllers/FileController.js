import data from '../../config/data';
import fileSystem from '../../fileSystem';

import User from '../models/User';

class FileController {

  async store_img(req, res) {
    try {     
      const user = await User.findById(req._id);
      const { originalname, filename } = req.file;
      
      if (user.img) await fileSystem.removeFile('img', user.img.path);
      await fileSystem.moveFile('img', filename);      
      
      const { _id, name, email, status, img, admin } = await User.findOneAndUpdate({ _id: user._id }, { img: {name: originalname, path: filename } }, { new: true });

      return res.json({ _id, name, email, status, img, admin });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

}

export default new FileController();