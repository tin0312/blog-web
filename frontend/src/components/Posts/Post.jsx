import React from "react";

function Post(props) {
  return (
    <div data-id="<%= post.id %> " className="post-container">
      <div>
        <h2>{/* <%= post.title %> */}</h2>
      </div>
      <div className="post-metadata">
        <p>
          {" "}
          <strong>by:</strong>
          {/* <%= post.author_username %> */}
        </p>
        <p>{/* <%= new Date(post.created_at).toLocaleDateString()%> */}</p>
        {/* <% if(post.updated_at) {%> */}
        <p>
          {/* <% const now = new Date() %>
                            <% const updated_at = new Date(post.updated_at)%>
                            <% if(now.getDay() === updated_at.getDay()) { %>
                                <% const currentTime = now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds() %> 
                                <% const updatedTime = updated_at.getHours() * 60 * 60 + updated_at.getMinutes() * 60 + updated_at.getSeconds() %> 
                                <% const timeDiff = currentTime - updatedTime %>
                                <% if(timeDiff > 3600){ %>
                                     <%= Math.floor(timeDiff / 3600) %>hr(s) ago
                                <% }  else if(timeDiff > 60) { %>
                                 <%= Math.floor( timeDiff / 60 ) %>min(s) ago
                                <% }  else { %>
                                 <%= timeDiff %>s ago
                            <% } %>
                            <% } else {%>
                                <% const dayDiff = now.getTime() -  updated_at.getTime()%> 
                                <% if((dayDiff / 86400000) < 1) {%>
                                    <%= Math.floor(dayDiff / 3600000 ) %>hr(s) ago
                                <% } else { %>
                                    <%= Math.floor( dayDiff/ 86400000)  %>day(s) ago
                               <% } %>
                               <% } %>   
                        <% } %> */}
        </p>
      </div>
    </div>
  );
}

export default Post;
