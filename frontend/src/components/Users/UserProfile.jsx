import React from "react";
import { useAuth } from "../../hooks/AuthProvider";
import Posts from "../Posts/Posts";
function UserProfile() {
  const { user } = useAuth();
  console.log("user in User Profile ", user);
  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <div className="profile-content">
          <img src="" alt="profile-image" />
          <div>
            <button>Edit Profile</button>
          </div>
          <h1>{user.username}</h1>
          <p>Bio</p>
          <p>Join Date</p>)
        </div>
        <div className="profile-posts">
          <Posts user={user} />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
