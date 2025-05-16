import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/AuthProvider";
import MarkDownEditor from "../UI/MarkDownEditor";
import UploadButton from "../UI/UploadButton";
import ButtonsBox from "../UI/ButtonsBox";

export default function CreatePost({ coverImage, title, content, handleEditPost, postCategory }) {
  const navigate = useNavigate();
  const { user, setIsNavHidden, category, setCategory } = useAuth();
  const [postContent, setPostContent] = useState("");
  const { pathname } = useLocation();
  const isEditting = matchPath("/:username/posts/:id/edit", pathname)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const registerOptions = {
    title: { required: "Post Title required" },
    content: { required: "Post Content required" },
  };
  useEffect(() => {
    if (postCategory) {
      setCategory(postCategory)
    }
  }, [])
  async function handleAddPost(post) {
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", postContent);
    formData.append("username", user.username);
    formData.append("coverImg", post.coverImg[0]);
    formData.append("category", category),
      formData.append("authorId", user.userId)
    try {
      const response = await fetch(
        "/api/posts/add-post",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );
      if (response.status === 201) {
        navigate("/");
        setIsNavHidden(false)
      } else {
        setError("serverError", {
          type: "custom",
          message: "Failed to create post",
        });
        setTimeout(() => {
          setError("serverError", null);
        }, 1000);
      }
    } catch (error) {
      console.log("Error saving post", error);
    }
  }


  return (
    <Container className="editor-wrapper" fluid>
      <form onSubmit={handleSubmit((post) => isEditting ? handleEditPost(post, postContent, category) : handleAddPost(post))}>
        <Row className="editor position-relative bg-white p-5">

          <Col>

            <Row>
              <Col className="pb-3">
                < UploadButton
                  label="Add a cover"
                  register={register}
                  name="coverImg"
                  existingFile={coverImage}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <input
                  className="mb-3"
                  type="text"
                  name="title"
                  defaultValue={title}
                  placeHolder={`Post title here...`}
                  {...register("title", registerOptions.title)}
                  autoFocus
                  required={!isEditting}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Dropdown onSelect={(eventKey) => setCategory(eventKey)}>
                  <Dropdown.Toggle className="mx-0 mb-3" variant="secondary" id="dropdown-basic">
                    {category}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>

                    <Dropdown.Item eventKey="software">Software</Dropdown.Item>
                    <Dropdown.Item eventKey="networking">Networking</Dropdown.Item>
                    <Dropdown.Item eventKey="penetration" >Penetration</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  < MarkDownEditor
                    setPostContent={setPostContent}
                    postContent={content || postContent}
                  />
                </div>

              </Col>
            </Row>
            <Row>
              <Col className="ps-0 mt-3">
                {isEditting ?
                  (<ButtonsBox buttonOneContent="Save" buttonTwoContent="Cancel" />) : (
                    <ButtonsBox buttonOneContent="Publish" buttonTwoContent="Save draft" />
                  )}
              </Col>
            </Row>

          </Col>

        </Row>
      </form>
    </Container>
  );
}

