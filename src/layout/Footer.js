import styled from "styled-components";
import { Layout, Menu, Row, Col } from "antd";
import { Link } from "react-router-dom";

import Logo from "assets/images/logo.png";

const { Footer } = Layout;

const menuItems = [
  {
    key: 1,
    label: "Sobre Nos",
  },
  {
    key: 2,
    label: "Loja",
  },
  {
    key: 3,
    label: "Contactos",
  },
];

const PPS_Footer = () => {
  return (
    <StyledFooter>
      <Container>
        <Col span={8}>
          <Link to="/">
            <LogoImg src={Logo} />
          </Link>
        </Col>
        <Col span={8}>
          <Menu mode="vertical" items={menuItems} />
        </Col>
        <Col span={8}>
          <Menu mode="vertical" items={menuItems} />
        </Col>
      </Container>
      <SubFooter>All rights reserved.</SubFooter>
    </StyledFooter>
  );
};

const StyledFooter = styled(Footer)`
  display: flex;
  flex-direction: column;
  padding: 20px 65px;
  background-color: var(--dark-gray);

  & .ant-menu {
    height: 100%;
    background: transparent;
    border: none;
    font-size: 16px;

    & li {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const Container = styled(Row)`
  max-width: 1440px;
  width: 100%;
  margin: auto;
`;

const SubFooter = styled(Container)`
  justify-content: center;
  padding-top: 15px;
`;

const LogoImg = styled.img`
  width: 200px;
  height: auto;
`;

export default PPS_Footer;
