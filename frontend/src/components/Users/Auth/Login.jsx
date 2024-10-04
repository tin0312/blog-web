import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../../hooks/AuthProvider";
import handleKeyUp from "../../../helpers/keyEvent";

function Login() {
  const auth = useAuth();
  const [user, setUser] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const [loginError, setLoginError] = useState("");
  async function handleLogin(event) {
    event.preventDefault();
    auth.logIn(user);
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
          <label htmlFor="title">Username or Email</label>
          <input
            type="text"
            id="title"
            name="username"
            value={user.username}
            onChange={(event) =>
              setUser((prevUserData) => ({
                ...prevUserData,
                username: event.target.value,
              }))
            }
            {...register("username", {
              required: "username required",
            })}
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={user.password}
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
            {...register("password-confirmation", {
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
            })}
            style={{
              border: loginError ? "1px solid red" : "1px solid transparent",
            }}
            name="password-confirmation"
            value={user.passwordConfirmation}
            onChange={(event) =>
              setUser((user) => ({
                ...user,
                passwordConfirmation: event.target.value,
              }))
            }
            onKeyUp={() =>
              handleKeyUp(
                user.password,
                user.passwordConfirmation,
                setLoginError
              )
            }
            required
          />
          <p
            className="error-message"
            style={{
              position: "absolute",
              bottom: "6rem",
            }}
          >
            {loginError}
          </p>
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
