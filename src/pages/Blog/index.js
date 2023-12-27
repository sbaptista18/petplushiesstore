import styled from "styled-components";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

import { PageHeader, TilePosts } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/custom/v1/get_blog_posts"
      );
      const data = await response.json();

      if (data.success) {
        if (data.data.length > 0) {
          setPosts(data.data);
        } else {
          setNoResults(true);
        }
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
        setMessage(data.message);
      }
    } catch (error) {
      setErrorPosts(true);
      setLoadingPosts(false);
      setMessagePosts(data.message);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  return (
    <>
      <PageHeader title="Blog" img={DummyImg} alt="Blog - Pet Plusies" />
      <Container>
        <ContentLocked>
          <div>
            <VerticalContent>
              <FeaturedContainer>
                {loading && !error && (
                  <Spinner
                    indicator={
                      <LoadingOutlined style={{ fontSize: 50 }} spin />
                    }
                  />
                )}
                {error && !loading && !noResults && <>{message}</>}
                {!error && !loading && noResults && <>{message}</>}
                {!error &&
                  !loading &&
                  !noResults &&
                  posts.map((p) => (
                    <TilePosts
                      key={p.ID}
                      id={p.ID}
                      name={p.post_title}
                      picture={p.post_image_url}
                      url={p.post_name}
                      category={p.categories[0]}
                      excerpt={p.post_excerpt}
                      size="large"
                    />
                  ))}
              </FeaturedContainer>
            </VerticalContent>
          </div>
        </ContentLocked>
      </Container>
    </>
  );
};

const Spinner = styled(Spin)`
  background-color: var(--white);
  width: 100%;
  height: 100%;
  position: relative;
`;

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

const VerticalContent = styled(Row)`
  padding: 30px 0;
  display: flex;
  flex-direction: column;
`;

const FeaturedContainer = styled(Row)`
  min-height: 500px;
  display: flex;
  position: relative;
  align-items: center;
  flex-wrap: wrap;
`;

export default {
  path: "/blog",
  exact: true,
  component: Blog,
};
