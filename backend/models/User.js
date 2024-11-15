const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 'required: true' means this field is mandatory
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields if necessary
});

module.exports = mongoose.model('User', userSchema);
