import { useState, useEffect, useRef } from 'react'
import _ from 'lodash'
import Blog from './components/Blog'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])

    const [user, setUser] = useState(null)

    const [message, setMessage] = useState(null)
    const [messageType, setType] = useState(null)

    const blogFormRef = useRef()
    const loginFormRef = useRef()

    const displayMsg = (message, type) => {
        setMessage(message)
        setType(type)
        setTimeout(() => {
            setMessage(null)
            setType(null)
        }, 5000)
    }

    const getBlogs = async () => {
        await blogService
            .getAll()
            .then(blogs => {
                const sortedBlogs = _.orderBy(blogs, ['likes'], ['desc'])
                setBlogs(sortedBlogs)
            })
    }

    const loginUser = async (userObj) => {
        try {
            const user = await loginService.login(userObj)

            blogService.setToken(user.token)
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
        } catch (error) {
            displayMsg(error.response.data.error, 'error')
        }
    }

    const addBlog = async (blog) => {
        try {
            blogFormRef.current.toggleVisibility()
            await blogService.createBlog(blog)
            getBlogs()
            displayMsg(`Created a blog '${blog.title}' by ${blog.author}`, 'success')

        } catch (error) {
            displayMsg(error.response.data.error, 'error')
        }
    }

    const likeBlog = async (blog) => {
        try {
            await blogService.likeBlog(blog)
            getBlogs()
        } catch (error) {
            displayMsg(error.response.data.error, 'error')
        }
    }

    const deleteBlog = async blogID => {
        try {
            await blogService.deleteBlog(blogID)
            getBlogs()
            displayMsg('Blog deleted!', 'success')
        } catch (error) {
            displayMsg(error.response.data.error, 'error')
        }
    }

    const handleLogout = async () => {
        setUser(null)
        window.localStorage.clear()
    }

    useEffect(() => {
        getBlogs()
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedInUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    return (
        <div>
            {
                user === null ?
                    // if a user is not logged in, display the login form
                    <>
                        <h2>Login Form</h2>

                        {/* show notifications here */}
                        {message && <Notification message={message} type={messageType} />}

                        <Togglable buttonLabel='Login' ref={loginFormRef}>
                            <LoginForm loginUser={loginUser} />
                        </Togglable>

                    </>

                    :
                    // if a user is logged in
                    <>
                        <h2>Blogs</h2>

                        {/* show notifications here */}
                        {message && <Notification message={message} type={messageType} />}

                        <div>
                            {user.name} logged in.
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                        <Togglable buttonLabel='Create Blog' ref={blogFormRef}>
                            <BlogForm addBlog={addBlog} />
                        </Togglable>
                        <br />
                        <div className='blogs'>
                            {blogs.map(blog =>
                                <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user} deleteBlog={deleteBlog} />
                            )}
                        </div>
                    </>
            }

        </div>
    )
}

export default App