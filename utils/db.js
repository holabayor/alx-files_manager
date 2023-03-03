const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/${database}`;

class DBClient {
  constructor() {
    this.isClientConnected = false;
    this.client = MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.client.connect((err) => {
      if (err) console.error(err);
      this.isClientConnected = true;
    });
  }

  isAlive() {
    return this.isClientConnected;
  }

  async nbUsers() {
    const users = await this.client.db().collection('users').countDocuments();
    return users;
  }

  async nbFiles() {
    const files = await this.client.db().collection('files').countDocuments();
    return files;
  }
}

const dbClient = new DBClient();

export default dbClient;
