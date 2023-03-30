const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')

// Define the schema for a User
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    // Do not include the password when querying for a user by default
    select: false
  }
}, schemaOptions)

// Create and export a User model using the defined schema
module.exports = mongoose.model('User', userSchema)