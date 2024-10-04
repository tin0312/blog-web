import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthProvider";
import { handleKeyUp, handleKeyDown } from "../../../helpers/keyEvent";

function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const { setUser } = useAuth();

  const navigate = useNavigate();
  async function handleSignUp(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/add-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            name,
            username,
            email,
            password,
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
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              id="title"
              name="name"
              placeholder="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              type="text"
              id="title"
              name="username"
              placeholder="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <input
              type="text"
              id="title"
              name="email"
              placeholder="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="enter password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <input
              id="password-confirmation"
              style={{
                border: signUpError ? "1px solid red" : "1px solid transparent",
              }}
              type="password"
              name="password-confirmation"
              placeholder="re-enter password"
              value={passwordConfirmation}
              onKeyUp={() =>
                handleKeyUp(password, passwordConfirmation, setSignUpError)
              }
              onKeyDown={() =>
                handleKeyDown(passwordConfirmation, setSignUpError)
              }
              required
              onChange={(event) => setPasswordConfirmation(event.target.value)}
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
