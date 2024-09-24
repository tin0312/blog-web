import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import UserMenu from "../Users/UserMenu";

function DesktopNav() {
  const [isUserMenu, setIsUserMenu] = useState(false);
  function handleOpenUserMenu() {
    setIsUserMenu((preState) => !preState);
  }
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
            onClick={handleOpenUserMenu}
            className="user-
                        container"
          >
            <img className="user-icon" src="/icon/user.png" alt="user-icon" />
            {isUserMenu && <UserMenu />}
          </div>
        </li>
      </ul>
    </>
  );
}

export default DesktopNav;
