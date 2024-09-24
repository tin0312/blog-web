import React from "react";
import { Link } from "react-router-dom";

function UserMenu() {
  return (
    <div className="user-drop-down">
      <ul>
        <li>
          <Link to="/login"> Sign in</Link>
        </li>
        <hr class="solid" />
        <li>
          <Link to="signup">Sign up</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <hr class="solid" />
        <li>
          <Link to="/log-out">
            <img class="user-icon" src="/icon/log-out.png" alt="user-icon" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default UserMenu;
