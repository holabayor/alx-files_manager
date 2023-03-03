// import redisClient from '../utils/redis';
import crypto from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).send({ error: 'Missing password' });
      return;
    }
    const users = await dbClient.db.collection('users').findOne({ email });
    console.log(users);
    if (users) {
      res.status(400).send({ error: 'Already exist' });
      return;
    }
    const hash = crypto.createHash('sha1').update(password).digest('hex');
    const user = await dbClient.db.collection('users').insertOne({ email, password: hash });
    res.status(201).send({ id: `${user.insertedId}`, email: `${email}` });
  }

  static getMe(req, res) {
    res.send({ status: 'Me' });
  }
}

export default UsersController;
