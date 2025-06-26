import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async newBlogObj => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newBlogObj, config)
  return response.data
}

const getBlog = async blogID => {
  const response = await axios.get(baseUrl, blogID)
  return response.data
}

const likeBlog = async updatedBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog, config)
  return response.data
}

export default { getAll, createBlog, setToken, getBlog, likeBlog }