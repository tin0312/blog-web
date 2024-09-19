import React from "react";

function MobileNav() {
  return (
    <>
      <span className="nav-icon hide">
        <i></i>
        <i></i>
        <i></i>
      </span>
      {/* Mobile Navigation */}
      <ul className="mobile-nav hide">
        <li>
          <a className="nav-link" href="/">
            posts
          </a>
        </li>
        <li>
          <a href="/login">
            <img className="user-icon" src="/icon/user.png" alt="user-icon" />
            <li>
              <a className="nav-link create-post-btn" href="/signup">
                Register
              </a>
            </li>
          </a>
        </li>
        <li>
          <a className="nav-link create-post-btn" href="/create-post">
            Create Post
          </a>
        </li>
        <li>
          <a className="nav-link" href="/profile">
            Profile
          </a>
        </li>
        <li>
          <a href="/log-out">
            <img
              className="user-icon"
              src="/icon/log-out.png"
              alt="user-icon"
            />
          </a>
        </li>
      </ul>
    </>
  );
}

export default MobileNav;
