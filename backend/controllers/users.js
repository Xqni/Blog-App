// define routes for handling user accounts
const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

// fetches all users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    // replaces the blog ids with blogs themselves
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })
  response.json(users)
})

// creating a new user
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // validation of user being created
  if (username.length < 3) return response.status(400).json({ error: 'username should at least be 3 characters long' })
  if (password.length < 3) return response.status(400).json({ error: 'password should at least be 3 characters long' })

  // hashing the password
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter