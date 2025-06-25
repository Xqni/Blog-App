const LoginForm = ({ onSubmit, value, onchange }) => (
    <>
        <form onSubmit={onSubmit}>
            <div>
                Username <br />
                <input
                    type="text"
                    value={value[0]}
                    name="Username"
                    onChange={onchange[0]}
                />
            </div>
            <div>
                Password <br />
                <input
                    type="password"
                    value={value[1]}
                    name="Password"
                    onChange={onchange[1]}
                />
            </div>
            <div></div>
            <br />
            <button type="submit">Login</button>
        </form>
    </>
)

export default LoginForm