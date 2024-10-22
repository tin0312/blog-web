import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/AuthProvider";
import handleKeyUp from "../../../helpers/keyEvent";

function Login() {
  const auth = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
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
      required: "re-enter password",
    },
  };

  return (
    <div>
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit(handleLogin)}>
          <label htmlFor="title">Username</label>
          <input
            style={{
              border: `1px solid ${errors.username ? "red" : "transparent"}`,
            }}
            type="text"
            id="title"
            name="username"
            placeholder="Username Or Email"
            {...register("username", registerOptions.username)}
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
          <label htmlFor="password">Password</label>
          <input
            style={{
              border: `1px solid ${errors.password ? "red" : "transparent"}`,
            }}
            id="password"
            type="password"
            name="password"
            placeholder="********"
            {...register("password", registerOptions.password)}
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
          <label htmlFor="password-confirmation">Password Confirmation</label>
          <input
            style={{
              border: `1px solid ${
                errors.passwordConfirmation ? "red" : "transparent"
              }`,
            }}
            id="password-confirmation"
            type="password"
            {...register(
              "passwordConfirmation",
              registerOptions.passwordConfirmation
            )}
            name="passwordConfirmation"
            onKeyUp={() =>
              handleKeyUp(
                watch("password"),
                watch("passwordConfirmation"),
                setError,
                clearErrors
              )
            }
            placeholder="********"
          />
          {errors.passwordConfirmation && (
            <p className="error-message">
              {errors.passwordConfirmation.message}
            </p>
          )}
          <div className="btn-container">
            <input type="submit" value="Log in" />
          </div>
        </form>

        <hr className="hr-text" data-content="OR" />

        <div className="google-signin-container">
          <a
            className="login-link"
            href={`${process.env.REACT_APP_BACKEND_URL}/users/auth/google`}
          >
            <i className="fab fa-google"></i> Sign in with Google
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
