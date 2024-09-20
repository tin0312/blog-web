import React from "react";

function PostEditor() {
  return (
    <div>
      <div className="post-wrapper">
        <div className="post post-edit-form">
          <form action="" method="POST">
            <input type="text" id="title" name="title" />
            <textarea id="auto-resizing-textarea" name="body"></textarea>
            <div className="btn-container">
              <a
                className="cancel-btn"
                href="/posts/<%= user.username %>/<%= post.id %>"
              >
                {" "}
                Cancel{" "}
              </a>
              <input type="submit" value="Save" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostEditor;
