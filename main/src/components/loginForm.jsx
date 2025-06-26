import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ loginUser }) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const handleUsername = ({ target }) => {
        setUsername(target.value)
    }

    const handlePassword = ({ target }) => {
        setPassword(target.value)
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        await loginUser({
            username: username,
            password: password
        })
        setUsername('')
        setPassword('')
    }


    return (
        <>
            <form onSubmit={handleLogin}>
                <div>
                    Username <br />
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        onChange={handleUsername}
                    />
                </div>
                <div>
                    Password <br />
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        onChange={handlePassword}
                    />
                </div>
                <div></div>
                <br />
                <button type="submit">Login</button>
            </form>
        </>
    )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsername: PropTypes.func.isRequired,
  handlePassword: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired
}

export default LoginForm