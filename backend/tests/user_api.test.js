const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const user1 = helper.initialUsers[0]
  await api
    .post('/api/users')
    .send(user1)
    .expect(201)

  const user2 = helper.initialUsers[1]
  await api
    .post('/api/users')
    .send(user2)
    .expect(201)
})

// All valid user tests
describe('Valid User Tests', () => {

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
  })

  // check if api returns JSON formatted data
  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // check if _id is deleted or not
  // moreso a test for toJSON function at ../models/user
  test('unique identifier is named id and not _id', async () => {
    const response = await api.get('/api/users')
    const users = response.body
    users.forEach(user => {
      // read documentation if dont get it
      // https://nodejs.org/api/assert.html#assertokvalue-message

      assert.ok(user.id)
      assert.strictEqual(user._id, undefined)
    })
  })

  test('adding a new user', async () => {
    const testUser = {
      username: 'poimii',
      name: 'Amy',
      password: 'qwerty'
    }

    await api
      .post('/api/users')
      .send(testUser)
      .expect(201)
      .expect('Content-type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes('poimii'))
  })
})

describe('Invalid User Tests', () => {

  test('username shorter than 3 char', async () => {
    const testUser = {
      username: 'am',
      name: 'Amy',
      password: 'qwerty'
    }

    await api
      .post('/api/users')
      .send(testUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('password shorter than 3 char', async () => {
    const testUser = {
      username: 'amyqt',
      name: 'Amy',
      password: 'qq'
    }

    await api
      .post('/api/users')
      .send(testUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })

  test('repeated username', async () => {
    const testUser = {
      username: 'damianqt',
      name: 'Amy',
      password: 'qwerty'
    }

    await api
      .post('/api/users')
      .send(testUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
  })
})

// closes db connection after tests
after(async () => {
  await mongoose.connection.close()
})