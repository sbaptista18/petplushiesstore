import styled from "styled-components";
import { Row } from "antd";

import { Button, Slideshow } from "components";

import { data } from "./slideshow_data";

const Homepage = () => {
  return (
    <Container>
      <Slideshow
        slides={data}
        settings={{
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 5000,
        }}
      />
      <ContentLocked>
        <h1>Homepage</h1>
        <StyledButton
          size="large"
          color="green"
          text="click here"
          type="primary"
        />
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

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default {
  path: "/",
  exact: true,
  component: Homepage,
};
