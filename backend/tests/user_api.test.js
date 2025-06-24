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

describe('Valid User Tests', () => {

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    assert.strictEqual(response.body.length, helper.initialUsers.length)
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

after(async () => {
  await mongoose.connection.close()
})