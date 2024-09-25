import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        }
      );

      const data = await response.json();
      if (data.message === "User created and logged in successfully") {
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
              onChange={(event) => setName(event.target.value)}
            />
            <input
              type="text"
              id="title"
              name="username"
              placeholder="username"
              onChange={(event) => setUsername(event.target.value)}
            />
            <input
              type="text"
              id="title"
              name="email"
              placeholder="email"
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="enter password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <input
              id="password-confirmation"
              type="password"
              name="password-confirmation"
              placeholder="re-enter password"
              required
              onChange={(event) => setConfirmPassword(event.target.value)}
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
