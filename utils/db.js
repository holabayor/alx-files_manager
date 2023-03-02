const DBClient = class {
  constructor() {
    this.host = 'localhost';
    this.port = 27017;
    this.database = 'files_manager';
  }
};

const dbClient = new DBClient();

export default dbClient;
