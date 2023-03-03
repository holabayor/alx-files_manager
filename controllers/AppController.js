import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(res, req) {
    req.status(200).send({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static getStats(res, req) {
    Promise.all([dbClient.nbUsers(), dbClient.nbFiles()])
      .then(([users, files]) => {
        req.status(200).send({
          users,
          files,
        });
      });
  }
}

export default AppController;
