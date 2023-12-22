import styled from "styled-components";
import { Row } from "antd";

import { LazyImage } from "fragments";

import BottomBar from "assets/images/bottom-bar.svg";

const PageHeader = ({ title, img, alt }) => {
  return (
    <Container>
      <ImgContainer>
        <LazyImage src={img} alt={alt} />
      </ImgContainer>

      <ContentLocked>
        <StyledH1>{title}</StyledH1>
      </ContentLocked>
      <StyledBottomBar />
    </Container>
  );
};

const StyledBottomBar = styled(BottomBar)`
  position: absolute;
  bottom: -1px;
  left: 0;
  fill: #fff;
`;

const Container = styled.div`
  width: 100%;
  position: relative;
  height: 500px;
`;

const ImgContainer = styled.div`
  width: 100%;
  position: fixed;
  height: 500px;
  z-index: -1;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  position: absolute;
  top: 0;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const StyledH1 = styled.h1`
  margin-top: 30px;
  font-size: 52px;
  color: white;
`;

export default PageHeader;