const mongoose = require('./db_config.js');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  userid: String,
  createTime: {
    type: Date,
    default: Date.now
  }
});

const noteSchema = new Schema({
  title: String,
  author: String,
  userid: String,
  tags: {
    type: [String],
    default: []
  },
  content: {
    type: String,
    default: ''
  },
  createTime: {
    type: Date,
    default: Date.now
  },
  modefiyTime: {
    type: Date,
    default: Date.now
  }
});

const notesSchema = new Schema({
  userid: String,
  notes: {
    type: [noteSchema],
    default: []
  }
});

module.exports = {
  User: mongoose.model('User', userSchema),
  Note: mongoose.model('Note', noteSchema),
  Notes: mongoose.model('Notes', notesSchema)
};
