const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

// re-initialize the test database before testing
// also get token before each test
let loggedInToken = ''
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  const loggedInUser = await api.post('/api/login')
    .send({
      'username': 'damianqt',
      'password': 'qwerty'
    })
    .expect(200)
  loggedInToken = loggedInUser.body.token
})

const getAuthHeader = () => {
  return { Authorization: `Bearer ${loggedInToken}` }
}

// All of the valid blog tests
describe('Valid Blog Tests', () => {
  // Test #1
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // Test #2
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  // Test #3
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

  // Test #4
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#a-true-full-stack-developers-oath',
      likes: 7000,
    }

    await api
      .post('/api/blogs')
      .set(getAuthHeader())
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const blogTitles = blogsAtEnd.map(blog => blog.title)
    assert(blogTitles.includes('async/await simplifies making async calls'))
  })

  // Test #5
  test('deleting a blog', async () => {
    const blogTitle = 'Adobe is horrible. So I tried the alternative'
    const blogs = await helper.blogsInDb()
    const blog = blogs.find(blog => blog.title === blogTitle)
    const blogId = blog.id
    await api
      .delete(`/api/blogs/${blogId}`)
      .set(getAuthHeader())
      .expect(204)
  })

  // Test #6
  test('updating a blog', async () => {
    const newBlog = {
      title: 'Tarik Reacts to Paper Rex vs G2 | PLAYOFFS | VCT Masters Toronto 2025',
      likes: 34725980234
    }

    const blogTitle = newBlog.title
    const blogs = await helper.blogsInDb()
    const blog = blogs.find(blog => blog.title === blogTitle)
    const blogId = blog.id

    await api
      .put(`/api/blogs/${blogId}`)
      .send(newBlog)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
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

// All invalid blog tests
describe('Invalid Blog Tests', () => {

  // Test #1
  test('is like property missing from request ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#a-true-full-stack-developers-oath',
    }

    await api
      .post('/api/blogs')
      .set(getAuthHeader())
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  })

  // Test #2
  test('are url or title properties missing ', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
    }

    await api
      .post('/api/blogs/')
      .set(getAuthHeader())
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  // Test #3
  test('a blog can\'t be added without token', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#a-true-full-stack-developers-oath',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})


after(async () => {
  await mongoose.connection.close()
})