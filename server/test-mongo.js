const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

mongoose.connect('mongodb://127.0.0.1:27017/chat', {
  serverSelectionTimeoutMS: 5000,
  family: 4
})
.then(() => {
  console.log('Successfully connected to MongoDB!');
  return mongoose.connection.db.admin().listDatabases();
})
.then(result => {
  console.log('Available databases:', result.databases.map(db => db.name));
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});