import React from "react";

function SignUp() {
  return (
    <div>
      <div className="signup-wrapper">
        <hr className="hr-text" data-content="Sign Up" />
        <div className="signup-form">
          <form action="/add-user" method="POST">
            <input type="text" id="title" name="name" placeholder="name" />
            <input
              type="text"
              id="title"
              name="username"
              placeholder="username"
            />
            <input type="text" id="title" name="email" placeholder="email" />
            <input
              id="password"
              type="password"
              name="password"
              placeholder="enter password"
              required
            />
            <input
              id="password-confirmation"
              type="password"
              name="password-confirmation"
              placeholder="re-enter password"
              required
            />
            <div className="btn-container">
              <a className="cancel-btn" href="/login">
                Login
              </a>
              <input type="submit" value="Sign up" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
