import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, matchPath, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import Markdown from 'marked-react';
import Reactions from "../UI/Reactions";
import convertTimestamp from "../../helpers/convertTimestamp";
import convertBinaryImageData from "../../helpers/convertImage";



function Post({ title, content, author, createdAt, updatedAt, profileFile, profileUrl, postCategory, coverImg }) {
  const [post, setPost] = useState();
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isAtSpecificPost = matchPath("/posts/:id", pathname) || matchPath("/:category/posts/:id", pathname);
  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await fetch(
          `/api/posts/${id}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const postContent = await response.json();
        setPost(postContent);
      } catch (error) {
        console.log("Error getting post ", error);
      }
    };
    if (isAtSpecificPost) {
      getPost();
    }

  }, [id]);

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
    coverImgFile,
    postCategory
  ) {
    navigate(`/${author}/posts/${id}/edit`, {
      state: {
        id,
        title,
        content,
        author,
        isCurrentUserPost,
        createdAt,
        coverImgFile,
        postCategory
      },
    });
  }


  const profilePicFile = convertBinaryImageData(profileFile || post?.profile_pic_file)
  const coverImgFile = convertBinaryImageData(coverImg || post?.cover_image)
  const updatedTime = convertTimestamp(updatedAt || post?.updated_at);
  return (
    <Container className={`${isAtSpecificPost ? "mt-md-5" : ""} fluid p-0`}>
      <Row className={`mx-0 ${isAtSpecificPost ? "post-outer-container" : ""}`}>
        {isAtSpecificPost && post && (<Col md={1} className="d-none d-md-block pt-md-5">
          <Reactions
            postId={id}
            authorId={post.author_id}
            loveCount={post.love_count}
            agreeCount={post.agree_count}
            mindBlownCount={post.mind_blown_count}
            onFireCount={post.on_fire_count}
            totalReactionCount={post.total_reaction_count}
            isLove={post.emotionStates.is_love}
            isAgree={post.emotionStates.is_agree}
            isMindBlown={post.emotionStates.is_mindblown}
            isOnFire={post.emotionStates.is_onfire}
          />
        </Col>)}

        <Col className="post-container px-0 mb-2">
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
                src={profileFile || post?.profile_pic_file ? profilePicFile : profileUrl || post?.profile_pic_url}
                alt="profile-image"
              />
              <div className="post-metadata">
                <p className="fw-bold">{author || post?.author_username}</p>
                <p className="date">
                  {new Date(createdAt || post?.created_at).toLocaleDateString()}
                </p>
                <p>{updatedAt || post?.updated_at && updatedTime}</p>
              </div>
            </Col>
            <Col xs={3} className="pt-2 text-end">
              <div>
                <Badge bg="secondary">{postCategory || post?.category}</Badge>
              </div>
            </Col>
          </Row>
          {/* Post metadata ends here */}
          <Row className="px-4">
            <Col>
              <h3>{title || post?.title}</h3>
              {isAtSpecificPost && <div className="post-content"><Markdown>{content || post?.content}</Markdown></div>}
            </Col>
            {state?.isCurrentUserPost && (
              <Row>
                <Col className="ps-0 py-3">
                  <Button className="me-2" variant="light" onClick={() => handleDeletePost(id)}>Delete</Button>
                  <Button
                    variant="dark"
                    onClick={() =>
                      handleEditPost(
                        post.id,
                        post.title,
                        post.content,
                        post.author_username,
                        state.isCurrentUserPost,
                        post.created_at,
                        coverImgFile,
                        post.category
                      )
                    }
                  >
                    Edit
                  </Button>
                </Col>
              </Row>
            )}
          </Row>
        </Col>
      </Row>
      {isAtSpecificPost && post && (<div className="d-md-none">
        <Reactions
          postId={id}
          authorId={post.author_id}
          loveCount={post.love_count}
          agreeCount={post.agree_count}
          mindBlownCount={post.mind_blown_count}
          onFireCount={post.on_fire_count}
          totalReactionCount={post.total_reaction_count}
          isLove={post.emotionStates.is_love}
          isAgree={post.emotionStates.is_agree}
          isMindBlown={post.emotionStates.is_mindblown}
          isOnFire={post.emotionStates.is_onfire}
        />
      </div>)}
    </Container>
  );
}

export default Post;
