// define schema for a user account

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true // this ensures the uniqueness of username
  },
  name: String,
  passwordHash: {
    type: String,
    minLength: 3,
    required: true
  },

  // stores blogs created by the user in an array
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog' // refrence to registered Blog model
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User