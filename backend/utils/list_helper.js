var _ = require('lodash')

// helper function to count likes
// needs an array of blogs
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum += blog.likes, 0)

// helper function to find the blog with most likes
// returns the blog not just likes
// needs an array of blogs
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
}

// helper function to find the author with most number of blogs
// returns an object with the other and number of blogs
// needs an array of blogs
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.countBy(blogs, 'author')

  const topAuthor = _.maxBy(Object.keys(grouped), author => grouped[author])

  return {
    author: topAuthor,
    blogs: grouped[topAuthor]
  }
}

// exporting these helper functions
module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs
}