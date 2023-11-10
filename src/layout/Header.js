import styled from "styled-components";
import { Layout, Menu, Col } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

import Logo from "assets/images/logo.png";

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

const PPS_Header = () => {
  return (
    <StyledHeader>
      <Col span={6}>
        <StyledLink to="/">
          <img src={Logo} />
        </StyledLink>
      </Col>
      <Col span={18}>
        <Menu mode="horizontal" items={menuItems} />
      </Col>
    </StyledHeader>
  );
};

const StyledHeader = styled(Header)`
  position: fixed;
  z-index: 2;
  display: flex;
  width: 100vw;
  height: var(--menu-height);
  padding: 20px 65px;
  background-color: var(--white);
  box-shadow: 0px 5px 30px 0px rgba(0, 0, 0, 0.1);

  & .ant-menu {
    height: 100%;
    display: flex;
    justify-content: flex-end;
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

const StyledLink = styled(Link)`
  display: flex;
  flex: 0 1 auto;
  height: 100%;
`;

export default PPS_Header;
