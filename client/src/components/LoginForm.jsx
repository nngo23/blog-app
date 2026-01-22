const LoginForm = ({
  handleLogin,
  username, handleUsername,
  password, handlePassword
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            value={username}
            placeholder="username"
            onChange={handleUsername}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            placeholder="password"
            onChange={handlePassword}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm