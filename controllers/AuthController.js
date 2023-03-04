import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    try {
      const authToken = req.header('Authorization').split(' ')[1];
      const auth = Buffer.from(authToken, 'base64').toString('utf8');
      const [email, password] = auth.split(':');
      const hash = crypto.createHash('sha1').update(password).digest('hex');
      const user = await dbClient.db.collection('users').findOne({ email, password: hash });
      if (!user) {
        res.status(401).send({ error: 'Unauthorized' });
        return;
      }
      const token = uuidv4();
      const key = `auth_${token}`;
      redisClient.set(key, user._id.toString(), 86400);

      res.status(200).send({ token });
    } catch (error) {
      res.status(401).send({ error: 'Unauthorized' });
    }
  }

  static async getDisconnect(req, res) {
    try {
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
      await redisClient.del(key);
      res.status(204).send({});
    } catch (error) {
      res.status(401).send({ error: 'Unauthorized' });
    }
  }
}

export default AuthController;
