import styled from "styled-components";
import { Row } from "antd";
import PropTypes from "prop-types";

import BottomBar from "assets/images/bottom-bar.svg";

const PageHeaderProduct = ({ title }) => {
  return (
    <Container>
      <ContentLocked>
        <StyledH1>{title}</StyledH1>
      </ContentLocked>
      <StyledBottomBar />
    </Container>
  );
};

PageHeaderProduct.propTypes = {
  title: PropTypes.string,
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
  height: 300px;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  position: absolute;
  top: 0;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--light-blue);
`;

const StyledH1 = styled.h1`
  font-size: 52px;
  color: var(--black);
`;

export default PageHeaderProduct;
