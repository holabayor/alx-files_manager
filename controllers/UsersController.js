// import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    console.log(email);
    const password = req.body ? req.body.password : null;
    if (!email) {
      res.status(400).send({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).send({ error: 'Missing password' });
      return;
    }
    const user = await dbClient.db;
    console.log(user);
    if (email) {
      res.status(400).send({ error: 'Already exist' });
      // console.log(dbClient);
      return;
    }
    console.log(dbClient);
  }
}

export default UsersController;
