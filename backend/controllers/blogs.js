const userExtractor = require('../utils/middleware/userExtractor')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// fetching all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, id: 1 })
  response.json(blogs)
})

// fetching a specific blog
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog
    .findById(request.params.id)
  response.json(blog)
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
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  } else if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).json({ error: 'User is not the creator of the blog' })
  }
})


// updating a single blog post
// mostly for likes
blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    blog.title = request.body.title || blog.title
    blog.author = request.body.author || blog.author
    blog.url = request.body.url || blog.url
    blog.likes = request.body.likes || blog.likes

    const savedBlog = await blog.save()
    response.status(204).json(savedBlog)
  } else {
    response.status(400).json({ error: 'Invalid blog ID' })
  }
})

module.exports = blogsRouter