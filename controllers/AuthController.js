import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    try {
      const authToken = req.header('Authorization').split(' ')[1];
      const auth = Buffer.from(authToken, 'base64').toString('utf8');
      const [email, password] = auth.split(':');
      console.log(email, password);
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
      const authToken = req.header('Authorization').split(' ')[1];
      const auth = Buffer.from(authToken, 'base64').toString('utf8');
      const [email, password] = auth.split(':');
      console.log(email, password);
      const hash = crypto.createHash('sha1').update(password).digest('hex');
      const user = await dbClient.db.collection('users').findOne({ email, password: hash });
      if (!user) {
        res.status(401).send({ error: 'Unauthorized' });
        return;
      }
      const token = uuidv4();
      const key = `auth_${token}`;
      redisClient.del(key);

      res.status(204).send({});
    } catch (error) {
      res.status(401).send({ error: 'Unauthorized' });
    }
  }
}

export default AuthController;
