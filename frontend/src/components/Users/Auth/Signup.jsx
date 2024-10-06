import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "../../../hooks/AuthProvider";
import handleKeyUp from "../../../helpers/keyEvent";

function SignUp() {
  const [signUpError, setSignUpError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const registerOptions = {
    name: {
      required: "name required",
    },
    email: {
      required: "email required",
    },
    password: {
      required: "password required",
    },
    passwordConfirmation: {
      required: "password confirmation missing",
    },
  };
  const { setUser } = useAuth();

  const navigate = useNavigate();
  async function handleSignUp(userInfo) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/add-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            name: userInfo.name,
            username: userInfo.username,
            email: userInfo.email,
            password: userInfo.password,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.status === 201) {
        setUser(data.user);
        navigate("/");
      }
    } catch (error) {
      console.error("Error adding users", error);
    }
  }

  return (
    <div>
      <div className="signup-wrapper">
        <hr className="hr-text" data-content="Sign Up" />
        <div className="signup-form">
          <form
            encType="multipart/form-data"
            onSubmit={handleSubmit(handleSignUp)}
          >
            <input
              type="text"
              id="title"
              name="name"
              {...register("name", registerOptions.name)}
              placeholder="name"
            />
            <input
              type="text"
              id="title"
              name="username"
              {...register("username")}
              placeholder="username"
            />
            <input
              type="text"
              id="title"
              name="email"
              {...register("email", registerOptions.email)}
              placeholder="email"
            />
            <input
              id="password"
              type="password"
              name="password"
              {...register("password", registerOptions.password)}
              placeholder="enter password"
              required
            />
            <input
              id="password-confirmation"
              style={{
                border: signUpError ? "1px solid red" : "1px solid transparent",
              }}
              type="password"
              name="password-confirmation"
              {...register(
                "passwordConfirmation",
                registerOptions.passwordConfirmation
              )}
              placeholder="re-enter password"
              onKeyUp={() =>
                handleKeyUp(
                  watch("password"),
                  watch("passwordConfirmation"),
                  setSignUpError
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
              {signUpError}
            </p>
            <label htmlFor="profile-pic">
              Choose a profile picture (optional)
            </label>
            <input
              type="file"
              id="profile-pic"
              name="profilePicFile"
              accept="image/png, img/jpeg"
            />
            <div className="btn-container">
              <Link to="/login">Login</Link>
              <input type="submit" value="Sign up" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
