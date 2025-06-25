const LoginForm = ({ onSubmit, value, onchange }) => (
    <>
        <h2>Login Form</h2>
        <form onSubmit={onSubmit}>
            <div>
                username <br />
                <input
                    type="text"
                    value={value[0]}
                    name="Username"
                    onChange={onchange[0]}
                />
            </div>
            <div>
                password <br />
                <input
                    type="password"
                    value={value[1]}
                    name="Password"
                    onChange={onchange[1]}
                />
            </div>
            <div></div>
            <br />
            <button type="submit">login</button>
        </form>
    </>
)

export default LoginForm