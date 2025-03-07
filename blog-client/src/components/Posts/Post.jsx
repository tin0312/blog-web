import React from "react";
import convertTimestamp from "../../helpers/convertTimestamp";
import convertBinaryImageData from "../../helpers/convertImage";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import Markdown from 'marked-react';



function Post({ id, title, content, author, createdAt, updatedAt, isCurrentUserPost, profileFile, profileUrl, coverImg, postCategory }) {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const isAtSpecificPost = matchPath("/posts/:id", pathname) || matchPath("/:category/posts/:id", pathname);
  async function handleDeletePost(id) {
    try {
      const response = await fetch(
        `/api/posts/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        navigate("/profile");
      }
    } catch (error) {
      console.log("Error deleting post");
    }
  }

  function handleEditPost(
    id,
    title,
    content,
    author,
    isCurrentUserPost,
    createdAt,
    coverImgFile
  ) {
    navigate(`/${author}/posts/${id}/edit`, {
      state: {
        id,
        title,
        content,
        author,
        isCurrentUserPost,
        createdAt,
        coverImgFile
      },
    });
  }


  const profilePicFile = convertBinaryImageData(profileFile)
  const coverImgFile = convertBinaryImageData(coverImg)
  const updatedTime = convertTimestamp(updatedAt);
  return (
    <Container className={`post-container p-0 mb-2  ${isAtSpecificPost ? "w-50  post-bottom-nav" : ""}`} fluid>
      {/* Post Cover Image */}
      <Row>
        {isAtSpecificPost && <Col>
          <img className="cover-image w-100" src={coverImgFile} alt="post-cover-image" />
        </Col>}
      </Row>
      {/* Post metadata starts here*/}
      <Row className="px-4">
        <Col xs={9} className="post-metadata-container d-flex align-items-center gap-2 p-2">
          <img
            className="profile-pic"
            src={profileFile ? profilePicFile : profileUrl}
            alt="profile-image"
          />
          <div className="post-metadata">
            <p className="fw-bold">{author}</p>
            <p className="date">
              {new Date(createdAt).toLocaleDateString()}
            </p>
            <p>{updatedAt && updatedTime}</p>
          </div>
        </Col>
        <Col xs={3} className="pt-2 text-end">
          <div>
            <Badge bg="secondary">{postCategory}</Badge>
          </div>
        </Col>
      </Row>
      {/* Post metadata ends here */}
      <Row className="px-4">
        <Col>
          <h3>{title}</h3>
          {isAtSpecificPost && <p className="post-content"><Markdown>{content}</Markdown></p>}
        </Col>
        {(isCurrentUserPost || state?.isCurrentUserPost) && (
          <Row>
            <Col className="ps-0 py-3">
              <Button className="me-2" variant="light" onClick={() => handleDeletePost(id)}>Delete</Button>
              <Button
                variant="dark"
                onClick={() =>
                  handleEditPost(
                    id,
                    title,
                    content,
                    author,
                    isCurrentUserPost,
                    createdAt,
                    coverImgFile
                  )
                }
              >
                Edit
              </Button>
            </Col>
          </Row>
        )}
      </Row>
    </Container>
  );
}

export default Post;
