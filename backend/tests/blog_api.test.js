const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

// re-initialize the test database before testing
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

// blog tests
describe('blog tests:', () => {

  // check if the api works
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // check if api returns JSON formatted data
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // check if _id is deleted or not
  // moreso a test for toJSON function at ../models/blog
  test('unique identifier is named id and not _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    blogs.forEach(blog => {
      // read documentation if dont get it
      // https://nodejs.org/api/assert.html#assertokvalue-message

      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })

  // check addition of a new blog is possible
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

  // check if the likes property is missing from the request
  // default to 0
  test('is like property missing from request ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'FullStack',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#a-true-full-stack-developers-oath',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  // check if the url or title properties are missing from the request
  test('are url or title properties missing ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'FullStack',
    }

    await api
      .post('/api/blogs/')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  // tests deleting route
  test('deleting a blog', async () => {
    const blogTitle = 'Adobe is horrible. So I tried the alternative'
    const blogs = await helper.blogsInDb()
    const blog = blogs.find(blog => blog.title === blogTitle)
    const blogId = blog.id
    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(204)
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