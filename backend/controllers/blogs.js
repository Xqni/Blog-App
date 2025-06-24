const blogsRouter = require('express').Router()
// const jwt = require('jsonwebtoken')
const helper = require('../tests/test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')


// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }


// fetching all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, id: 1})
  response.json(blogs)
})


// adding new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.user)

  // const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: 'token invalid' })
  // }
  // const user = await User.findById(decodedToken.id)

  // if (!user) {
  //   return response.status(400).json({ error: 'userId missing or not valid' })
  // }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
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

  const blog = await Blog.findById(request.params.id)
  blog.title = title || blog.title
  blog.author = author || blog.author
  blog.url = url || blog.url
  blog.likes = likes || blog.likes

  const savedBlog = await blog.save()
  response.status(204).json(savedBlog)
})

module.exports = blogsRouter