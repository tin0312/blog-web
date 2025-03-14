import React from "react";
import { Container, Row, Col } from "react-bootstrap"
import TopicsNav from "../UI/TopicsNav";
import PostsEssentials from "../UI/PostsEssentials";

function HomePosts() {
  return (
    <Container className="home-wrapper" fluid>
      <Row>
        <Col md={3} >
          <PostsEssentials />
        </Col>
        <Col md={9}>
          <Row>
            < TopicsNav />
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePosts;
