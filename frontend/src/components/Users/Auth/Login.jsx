import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthProvider";

function Login() {
  const auth = useAuth();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  // const [loginError, setLoginError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    auth.logIn(user);
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
            onChange={(event) =>
              setUser((prevUserData) => ({
                ...prevUserData,
                username: event.target.value,
              }))
            }
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            onChange={(event) =>
              setUser((prevUserData) => ({
                ...prevUserData,
                password: event.target.value,
              }))
            }
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
