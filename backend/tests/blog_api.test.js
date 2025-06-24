const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('blog tests:', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'FullStack',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#a-true-full-stack-developers-oath',
      likes: 7000
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const blogTitles = blogsAtEnd.map(blog => blog.title)
    assert(blogTitles.includes('async/await simplifies making async calls'))
  })

  // test('a specific note can be viewed', async () => {
  //   const notesAtStart = await helper.notesInDb()
  //   const noteToView = notesAtStart[0]

  //   const resultNote = await api
  //     .get(`/api/notes/${noteToView.id}`)
  //     .expect(200)
  //     .expect('Content-Type', /application\/json/)

  //   assert.deepStrictEqual(resultNote.body, noteToView)
  // })

  // test('a note can be deleted', async () => {
  //   const notesAtStart = await helper.notesInDb()
  //   const noteToDelete = notesAtStart[0]

  //   await api
  //     .delete(`/api/notes/${noteToDelete.id}`)
  //     .expect(204)

  //   const notesAtEnd = await helper.notesInDb()

  //   const contents = notesAtEnd.map(n => n.content)
  //   assert(!contents.includes(noteToDelete.content))

  //   assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
  // })
})

after(async () => {
  await mongoose.connection.close()
})