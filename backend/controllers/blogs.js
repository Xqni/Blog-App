const userExtractor = require('../utils/middleware/userExtractor')
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')


// fetching all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, id: 1 })
  response.json(blogs)
})


// adding new blog
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: request.user.id
  })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()
  response.status(201).json(savedBlog)
})


// deleting a blog
blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(400).json({ error: 'User is not the creator of the blog' })
  }
})


// updating a single blog post
// mostly for likes
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  blog.title = title || blog.title
  blog.author = author || blog.author
  blog.url = url || blog.url
  blog.likes = likes || blog.likes

  const savedBlog = await blog.save()
  response.status(204).json(savedBlog)
})

module.exports = blogsRouter