import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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
            // noteService.setToken(user.token)
        }
    }, [])

    return (
        <div>
            {
                user === null ?
                    <LoginForm onSubmit={handleLogin} onchange={[handleUsername, handlePassword]} value={[username, password]} />
                    :
                    <div>
                        <h2>Blogs</h2>
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