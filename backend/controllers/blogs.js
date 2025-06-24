const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// fetching all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


// adding new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})


// deleting a blog
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


// updating a single blog post
// mostly for likes
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog  = await Blog.findById(request.params.id)
  blog.title = title || blog.title
  blog.author = author || blog.author
  blog.url = url || blog.url
  blog.likes = likes || blog.likes

  const savedBlog = await blog.save()
  response.status(204).json(savedBlog)
})

module.exports = blogsRouter