import React from "react";
import { Link } from "react-router-dom";

function DesktopNav(){
    return(
        <>
          {/* Desktop Nabigation */}
          <ul className="desktop-nav">
            <li><a className="nav-link" href="/">posts</a></li>
                <li><a className="create-post-btn" href="/create-post">Create Post</a></li>
                    <li>
                        <div className="user-
                        ntainer">
                            <img className="user-icon" src="/icon/user.png" alt="user-icon" />
                            <div className="user-drop-down hide">
                                {/* <ul>
                                  
                                        <li><a class="nav-link" href="/login">Sign in</a></li>
                                        <hr class="solid">
                                        <li><a class="nav-link" href="/signup">Sign up</a></li>
                                        <% } else {%>
                                            <li><a class="nav-link" href="/profile">
                                                    Profile
                                                </a></li>
                                            <hr class="solid">
                                            <li><a class="nav-link" href="/log-out">
                                                    <img class="user-icon" src="/icon/log-out.png" alt="user-icon" />

                                                </a>
                                            </li>
                                          
                                </ul> */}
                            </div>
                        </div>
                    </li>
        </ul>
      
        </>
    )
}

export default DesktopNav