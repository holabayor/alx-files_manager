// import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const crypto = require('crypto');

class AuthController {
  static async getConnect(req, res) {
    const authToken = req.header('Authorization').split(' ')[1];
    const auth = Buffer.from(authToken, 'base64').toString('utf8');
    const [email, password] = auth.split(':');
    console.log(email, password);
    const hash = crypto.createHash('sha1').update(password).digest('hex');
    const user = await dbClient.db.collection('users').findOne({ email, password: hash });
    if (!user) {
      res.status(401).send({ error: 'Unauthorized' });
    }

    res.status(201).send({ id: `${user.insertedId}`, email: `${email}` });
  }

  static async getDisconnect(req, res) {
    res.send({ status: 'Disconnected' });
  }
}

export default AuthController;
