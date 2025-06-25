import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setURL] = useState('')

    const [user, setUser] = useState(null)

    const [message, setMessage] = useState(null)
    const [messageType, setType] = useState(null)


    const handleUsername = ({ target }) => {
        setUsername(target.value)
    }

    const handlePassword = ({ target }) => {
        setPassword(target.value)
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password
            })

            blogService.setToken(user.token)
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))
            // noteService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (error) {
            setMessage(error.response.data.error)
            setType('error')
            setTimeout(() => {
                setMessage(null)
                setType(null)
            }, 5000)
        }
    }
    const handleBlogCreate = async (event) => {
        event.preventDefault()

        try {
            await blogService.createBlog({
                title: title,
                author: author,
                url: url
            })
            await blogService
                .getAll()
                .then(blogs =>
                    setBlogs(blogs)
                )
            setMessage(`Created a blog '${title}' by ${author}`)
            setType('success')
            setTimeout(() => {
                setMessage(null)
                setType(null)
            }, 5000)
            setTitle('')
            setAuthor('')
            setURL('')
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

    const handleTitleChange = ({ target }) => {
        setTitle(target.value)
    }

    const handleAuthorChange = ({ target }) => {
        setAuthor(target.value)
    }

    const handleURLChange = ({ target }) => {
        setURL(target.value)
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

                        <LoginForm onSubmit={handleLogin} onchange={[handleUsername, handlePassword]} value={[username, password]} />
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

                        <BlogForm onSubmit={handleBlogCreate} value={[title, author, url]} onChange={[handleTitleChange, handleAuthorChange, handleURLChange]} />

                        <br />


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