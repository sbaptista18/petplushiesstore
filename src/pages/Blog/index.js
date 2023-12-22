import styled from "styled-components";
import { Row } from "antd";

const Blog = () => {
  return (
    <Container>
      <ContentLocked>
        <StyledH1>Blog</StyledH1>
      </ContentLocked>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
`;

const StyledH1 = styled.h1`
  margin-top: 30px;
  font-size: 52px;
`;

export default {
  path: "/blog",
  exact: true,
  component: Blog,
};
