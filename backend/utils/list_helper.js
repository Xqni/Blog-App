var _ = require('lodash')

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum += blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.countBy(blogs, 'author')

  const topAuthor = _.maxBy(Object.keys(grouped), author => grouped[author])

  return {
    author: topAuthor,
    blogs: grouped[topAuthor]
  }
}


module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs
}