import styled from "styled-components";
import { Layout, Menu, Col } from "antd";
import { Link, useHistory } from "react-router-dom";
import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Logo from "assets/images/logo.png";

const { Header } = Layout;

const onClickSectionRegistry = {
  home: (history) => history.push(""),
  "sobre-nos": (history) => history.push("/sobre-nos"),
  produtos: (history) => history.push("/produtos"),
  contactos: (history) => history.push("/contactos"),
};

const buildMenuItemProps = (key) => {
  return {
    key,
    label: _.startCase(key),
  };
};

const pages = ["sobre-nos", "produtos", "contactos"];

const PPS_Header = () => {
  const history = useHistory();

  return (
    <StyledHeader>
      <Col span={6}>
        <StyledLink to="/">
          <img src={Logo} />
        </StyledLink>
      </Col>
      <MenuContainer span={18}>
        <Menu
          mode="horizontal"
          overflowedIndicator={<MenuOutlined />}
          items={pages.map(buildMenuItemProps)}
          onClick={({ key }) => {
            onClickSectionRegistry[key](history);
          }}
        />
        <IconLink to="/carrinho">
          <ShoppingCartOutlined />
        </IconLink>
        <IconLink to="/login">
          <UserOutlined />
        </IconLink>
      </MenuContainer>
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
    width: 700px;

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

const MenuContainer = styled(Col)`
  width: auto;
  display: flex;
  justify-content: flex-end;
`;

const IconLink = styled(StyledLink)`
  width: 70px;
  align-items: center;
  justify-content: center;
  color: black;

  &:hover {
    color: #1890ff;
  }
`;

export default PPS_Header;
