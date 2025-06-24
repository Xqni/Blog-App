const Blog = require('../models/blog')
const User = require('../models/user')

// test blogs
const initialBlogs = [
  {
    title: 'Adobe is horrible. So I tried the alternative',
    author: 'Bog',
    url: 'https://youtu.be/zabpcOP7H3U?si=RycNVmn3r3cMiI6R',
    likes: 47000,
    user: '685a99bd70a59d47ebfde704'
  },
  {
    title: 'Tarik Reacts to Paper Rex vs G2 | PLAYOFFS | VCT Masters Toronto 2025',
    author: 'Tarik',
    url: 'https://www.youtube.com/watch?v=mrR3qxVDN_g',
    likes: 3300,
    user: '685a99bd70a59d47ebfde704'
  }
]

// test users
const initialUsers = [
  {
    username: 'damianqt',
    name: 'Damian',
    password: 'qwerty'
  },
  {
    username: 'tarikqt',
    name: 'Tarik',
    password: 'qwerty'
  }
]

// fetches all blogs in the test db
const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}


// fetches all users in the test db
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, initialUsers, blogsInDb, usersInDb
}