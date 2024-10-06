import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/AuthProvider";
import handleKeyUp from "../../../helpers/keyEvent";

function Login() {
  const auth = useAuth();
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  async function handleLogin(loginCredentials) {
    auth.logIn(loginCredentials);
  }

  const registerOptions = {
    username: {
      required: "username required",
    },
    password: {
      required: "password required",
    },
    passwordConfirmation: {
      required: "password confirmation missing",
    },
  };
  return (
    <div>
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
          <label htmlFor="title">Username</label>
          <input
            type="text"
            id="title"
            name="username"
            placeholder="Username Or Email"
            {...register("username", registerOptions.username)}
          />
          {/* {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )} */}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="********"
            {...register("password", registerOptions.password)}
          />
          {/* {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )} */}
          <label htmlFor="password-confirmation">Password Confirmation</label>
          <input
            id="password-confirmation"
            type="password"
            {...register(
              "password-confirmation",
              registerOptions.passwordConfirmation
            )}
            style={{
              border: loginError ? "1px solid red" : "1px solid transparent",
            }}
            name="password-confirmation"
            onKeyUp={() =>
              handleKeyUp(
                watch("password"),
                watch("password-confirmation"),
                setLoginError
              )
            }
            placeholder="********"
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
          {/* {errors.passwordConfirmation && (
            <p className="error-message">
              {errors.passwordConfirmation.message}
            </p>
          )} */}
          <div className="btn-container">
            <input type="submit" value="Log in" />
          </div>
        </form>

        <hr className="hr-text" data-content="OR" />

        <div className="google-signin-container">
          <a href={`${process.env.REACT_APP_BACKEND_URL}/auth/google`}>
            <i className="fab fa-google"></i> Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
