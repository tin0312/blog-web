import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../hooks/AuthProvider";
import handleKeyUp from "../../../helpers/keyEvent";
import usePasswordToggle from "../../../hooks/usePasswordToggle";

function Login() {
  const { logIn, loginError } = useAuth();
  const { passwordType, passwordConfirmationType, togglePasswordVisibility } =
    usePasswordToggle();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  function handleLogin(loginCredentials) {
    logIn(loginCredentials);
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
              outline: "none",
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
          <div className="input-container">
            <input
              style={{
                border: `1px solid ${errors.password ? "red" : "transparent"}`,
                outline: "none",
              }}
              type={passwordType}
              id="password"
              name="password"
              {...register("password", registerOptions.password)}
              placeholder="Password"
            />
            <img
              className="input-icon"
              onClick={() => togglePasswordVisibility("password")}
              id="password-visibility"
              src={`/icon/eye-${
                passwordType === "password" ? "close" : "open"
              }.png`}
              alt="eye-icon"
            />
          </div>
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
          <label htmlFor="password-confirmation">Password Confirmation</label>
          <div className="input-container">
            <input
              style={{
                border: `1px solid ${
                  errors.passwordConfirmation ? "red" : "transparent"
                }`,
                outline: "none",
              }}
              type={passwordConfirmationType}
              id="passwordConfirmation"
              name="passwordConfirmation"
              {...register(
                "passwordConfirmation",
                registerOptions.passwordConfirmation
              )}
              placeholder="Confirm password"
              onKeyUp={() =>
                handleKeyUp(
                  watch("password"),
                  watch("passwordConfirmation"),
                  setError,
                  clearErrors
                )
              }
            />
            <img
              className="input-icon"
              onClick={() => togglePasswordVisibility("passwordConfirmation")}
              id="password-visibility"
              src={`/icon/eye-${
                passwordConfirmationType === "password" ? "close" : "open"
              }.png`}
              alt="eye-icon"
            />
          </div>
          {errors.passwordConfirmation && (
            <p className="error-message">
              {errors.passwordConfirmation.message}
            </p>
          )}
          {loginError && <p className="error-message">{loginError}</p>}
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
