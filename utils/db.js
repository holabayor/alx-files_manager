const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}`;

class DBClient {
  constructor() {
    this.client = MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    try {
      this.client.connect();
      // .then(() => {
      // this.db = this.client.db(`${database}`);
      // console.log('Connected');
      // })
    } catch (error) { console.log(error); }
  }
  /*
    this.isClientConnected = false;
    this.client = new MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    async function connect() {
      try {
        await this.client.connect();
        const db = this.client.db(database);
        console.log(
          `Successfully connected to db ${db.databaseName}`,

        );
        this.isClientConnected = true;
      } catch (err) {
        console.error(`we encountered ${err}`);
      }
      this.isClientConnected = false;
    }
    connect();
    */

  isAlive() {
    if (this.db) return true;
    return false;
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
