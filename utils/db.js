const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.isClientConnected = false;
    this.db = '';
    MongoClient.connect(url, {
      useUnifiedTopology: true, useNewUrlParser: true,
    }, (err, client) => {
      if (err) {
        console.error(err);
      }
      this.db = client.db(database);
      // console.log(`Database connection established to ${database}`);
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async nbUsers() {
    const users = await this.db.collection('users').countDocuments();
    return users;
  }

  async nbFiles() {
    const files = await this.db.collection('files').countDocuments();
    return files;
  }
}

const dbClient = new DBClient();

export default dbClient;
