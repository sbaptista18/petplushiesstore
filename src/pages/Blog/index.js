import styled from "styled-components";
import { Row } from "antd";
import { useState, useEffect } from "react";

import { PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const Blog = () => {
  const [posts, setPosts] = useState([]);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/custom/v1/blog-posts"
      );
      const blogPosts = await response.json();

      console.log(blogPosts);
    } catch (error) {
      console.error("Error fetching the blog posts:", error);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return (
    <>
      <PageHeader title="Blog" img={DummyImg} alt="Blog - Pet Plusies" />
      <Container>
        <ContentLocked></ContentLocked>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
  min-height: 500px;
`;

export default {
  path: "/blog",
  exact: true,
  component: Blog,
};
