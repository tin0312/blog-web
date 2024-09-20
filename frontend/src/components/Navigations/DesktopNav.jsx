import React from "react";
import { Link } from "react-router-dom";

function DesktopNav() {
  return (
    <>
      {/* Desktop Nabigation */}
      <ul className="desktop-nav">
        <li>
          <a className="nav-link" href="/">
            posts
          </a>
        </li>
        <li>
          <Link to="/create-post" className="create-post-btn">
            Create Post
          </Link>
        </li>
        <li>
          <div
            className="user-
                        ntainer"
          >
            <img className="user-icon" src="/icon/user.png" alt="user-icon" />
          </div>
        </li>
      </ul>
    </>
  );
}

export default DesktopNav;
