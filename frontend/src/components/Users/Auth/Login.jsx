import React, { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState();
  const [loginError, setLoginError] = useState("");

  async function handleLogin() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        {
          method: "POST",
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );
    } catch (error) {
      console.log("Error Loging In", error);
    }
  }
  return (
    <div>
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleLogin}>
          <label htmlFor="title">Username or Email</label>
          <input
            type="text"
            id="title"
            name="username"
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <label htmlFor="password-confirmation">Password Confirmation</label>
          <input
            id="password-confirmation"
            type="password"
            name="password-confirmation"
            required
          />
          <div className="btn-container">
            <input type="submit" value="Log in" />
          </div>
        </form>

        <hr className="hr-text" data-content="OR" />

        <div className="google-signin-container">
          <Link to="/auth/google">
            <i className="fab fa-google"></i> Sign in with Google
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
