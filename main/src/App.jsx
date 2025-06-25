import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
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

    const [ErrorMessage, setErrorMessage] = useState(null)


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
        } catch (exception) {
            setErrorMessage('Wrong credentials')
            console.log(ErrorMessage)
            console.log(exception)
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000);
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
            setTitle('')
            setAuthor('')
            setURL('')
        }
        catch (exception) {
            console.log(exception)
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
                    <LoginForm onSubmit={handleLogin} onchange={[handleUsername, handlePassword]} value={[username, password]} />
                    :
                    // if a user is logged in
                    <div>
                        <h2>Blogs</h2>
                        <div>
                            <h3>Create New</h3>
                            <form onSubmit={handleBlogCreate}>
                                <div>
                                    title
                                    <input type="text" name="Title" value={title} onChange={handleTitleChange} />
                                </div>
                                <div>
                                    author
                                    <input type="text" name="Author" value={author} onChange={handleAuthorChange} />
                                </div>
                                <div>
                                    url
                                    <input type="text" name="URL" value={url} onChange={handleURLChange} />
                                </div>
                                <button type="submit">create</button>
                            </form>
                        </div>
                        <br />
                        <div>
                            {user.name} logged in
                            <button onClick={handleLogout}>logout</button>
                        </div>
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