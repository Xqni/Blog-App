const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Adobe is horrible. So I tried the alternative',
    author: 'Bog',
    url: 'https://youtu.be/zabpcOP7H3U?si=RycNVmn3r3cMiI6R',
    likes: 47000
  },
  {
    title: 'Tarik Reacts to Paper Rex vs G2 | PLAYOFFS | VCT Masters Toronto 2025',
    author: 'Tarik',
    url: 'https://www.youtube.com/watch?v=mrR3qxVDN_g',
    likes: 3300
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}