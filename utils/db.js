const { MongoClient } = require('mongodb');

const DBClient = class {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/${database}`;
    this.isConnected = true;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect((err) => {
      if (err) throw err;
      this.isConnected = false;
    });
  }

  isAlive() {
    return this.isConnected;
  }

  async nbUsers() {
    const users = await this.client.db().collection('users').countDocuments();
    return users;
  }

  async nbFiles() {
    const files = this.client.db().collection('files').countDocuments();
    return files;
  }
};

const dbClient = new DBClient();
export default dbClient;
