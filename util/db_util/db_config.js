const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/noteOL', { useMongoClient: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.Promise = global.Promise;

module.exports = mongoose;
