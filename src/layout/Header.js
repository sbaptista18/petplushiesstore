import styled from "styled-components";
import { Layout, Menu, Col } from "antd";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCart } from "../reducers/CartContext";

import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Logo from "assets/images/logo.png";

import CreateLocalStorageKey from "../reducers/CreateLocalStorageKey";

import { ConnectWC } from "fragments";

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
  const [productsNr, setProductsNr] = useState(0);
  const [sessionKey, setSessionKey] = useState(null);
  const history = useHistory();

  const { setSessionKeyAndCartId } = useCart();

  CreateLocalStorageKey();

  useEffect(() => {
    const storedSessionData = localStorage.getItem("sessionDataCart");

    if (storedSessionData) {
      const { key } = JSON.parse(storedSessionData);
      setSessionKey(key);
      if (key !== sessionKey) {
        fetchCartId(key);
        setSessionKeyAndCartId(key, null); // set null as cartId initially
      }
    } else {
      console.log("create session key, header");
      // Handle the case where the session key is not found in local storage
      // For example, generate a new session key and store it in local storage
      const newSessionKey = generateSessionKey();
      setSessionKey(newSessionKey);
      setSessionInLocalStorage(newSessionKey);
    }
  }, [setSessionKeyAndCartId]);

  const fetchCartId = async (sessionKey) => {
    ConnectWC.get("temp_carts")
      .then((data) => {
        const cartLocalSession = data.success.find(
          (cart) => cart.local_session_key === sessionKey
        );
        setSessionKeyAndCartId(sessionKey, cartLocalSession.id);
        fetchCartProducts(cartLocalSession.id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchCartProducts = async (cartId) => {
    ConnectWC.get("temp_cart_products", { temp_cart_id: cartId })
      .then((data) => {
        if (data.success.length > 0) {
          const totalQuantity = data.success.reduce((accumulator, prods) => {
            return accumulator + parseInt(prods.product_qty, 10);
          }, 0);

          setProductsNr(totalQuantity);
        } else {
          setProductsNr(0);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          {productsNr != 0 && (
            <CartProductsNr>
              <span>{productsNr}</span>
            </CartProductsNr>
          )}
        </IconLink>
        <IconLink to="/login">
          <UserOutlined />
        </IconLink>
      </MenuContainer>
    </StyledHeader>
  );
};

const CartProductsNr = styled.div`
  border-radius: 50%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  margin-left: -7px;
  margin-top: -17px;

  & span {
    color: white;
    font-size: 10px;
  }
`;

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
  position: relative;

  &:hover {
    color: #1890ff;
  }
`;

export default PPS_Header;
