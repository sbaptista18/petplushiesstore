import styled from "styled-components";
import { Row, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import { Breadcrumbs, ShareSocials, PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

moment.locale("pt");

const BlogPost = () => {
  const { postUrl } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_blog_post_by_slug?slug=${postUrl}`
        );
        const data = await response.json();

        console.log("data:", data.post);

        if (data.success) {
          setPost(data.post);
          setLoading(false);
        } else {
          setLoading(false);
          setMessage(data.message);
        }
      } catch (error) {
        setError(true);
        setMessage(error);
      }
    };

    fetchBlogPost();
  }, [postUrl]);

  return (
    <div style={{ position: "relative" }}>
      {loading && !error && (
        <Spinner
          indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
        />
      )}
      {error && !loading && <>{message}</>}
      {post != undefined && (
        <>
          <PageHeader
            title={post.title}
            img={post.featured_image}
            alt={`${post.title} - Pet Plusies`}
          />
          <Container>
            <ContentLocked>
              <Breadcrumbs page="/blog" item={post.title} />
              <StyledRow>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </StyledRow>
            </ContentLocked>
          </Container>
        </>
      )}
    </div>
  );
};

const Spinner = styled(Spin)`
  position: absolute;
  background-color: var(--white);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
  padding-top: 50px;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
  position: relative;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
`;

export default {
  path: "/blog/:postUrl",
  exact: true,
  component: BlogPost,
};
