const jwt = require('jsonwebtoken')
const User = require('../../models/user')

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (user) {
    request.user = user
  } else {
    request.user = null
  }

  next()
}

module.exports = userExtractor