import { useState, useEffect, useRef } from 'react'
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

    const loginUser = async (userObj) => {
        try {
            const user = await loginService.login(userObj)

            blogService.setToken(user.token)
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))
            // noteService.setToken(user.token)
            setUser(user)
        } catch (error) {
            setMessage(error.response.data.error)
            setType('error')
            setTimeout(() => {
                setMessage(null)
                setType(null)
            }, 5000)
        }
    }

    const addBlog = async (blog) => {
        try {
            await blogService.createBlog(blog)
            await blogService
                .getAll()
                .then(blogs =>
                    setBlogs(blogs)
                )
            setMessage(`Created a blog '${blog.title}' by ${blog.author}`)
            blogFormRef.current.toggleVisibility()
            setType('success')
            setTimeout(() => {
                setMessage(null)
                setType(null)
            }, 5000)

        }
        catch (error) {
            setMessage(error.response.data.error)
            setType('error')
            setTimeout(() => {
                setMessage(null)
                setType(null)
            }, 5000)
        }
    }


    const handleLogout = async () => {
        setUser(null)
        window.localStorage.clear()
    }

    useEffect(() => {
        blogService
            .getAll()
            .then(blogs =>
                setBlogs(blogs)
            )
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
                    <div>
                        <h2>Login Form</h2>

                        {/* show notifications here */}
                        {message && <Notification message={message} type={messageType} />}

                        <Togglable buttonLabel='Login' ref={loginFormRef}>
                            <LoginForm loginUser={loginUser} />
                        </Togglable>

                    </div>

                    :
                    // if a user is logged in
                    <div>
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
                        <div>
                            {blogs.map(blog =>
                                <Blog key={blog.id} blog={blog} />
                            )}
                        </div>
                    </div>
            }

        </div>
    )
}

export default App