const { MongoClient } = require('mongodb');

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${host}:${port}/${database}`;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, db) => {
  if (err) throw err;
  console.log('Connected to database');
  db.close();
});
