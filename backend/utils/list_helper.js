const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum += blog.likes, 0)

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  return blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max)
}


module.exports = {
  totalLikes,
  favoriteBlog
}