import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

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
    if (users) {
      res.status(400).send({ error: 'Already exist' });
      return;
    }
    const hash = crypto.createHash('sha1').update(password).digest('hex');
    const user = await dbClient.db.collection('users').insertOne({ email, password: hash });
    res.status(201).send({ id: `${user.insertedId}`, email: `${email}` });
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const user = await dbClient.db.collection('users').findOne({ _id: ObjectId(userId) });
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    res.status(200).send({ id: userId, email: user.email });
  }
}

export default UsersController;
