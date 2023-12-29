import styled from "styled-components";
import { Layout, Menu, Col } from "antd";
import { useState, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";

import { useCart, CreateCartKey } from "reducers";
import {
  generateSessionKey,
  setSessionInLocalStorage,
  getSessionDataFromLocalStorage,
} from "helpers";

import {
  MenuOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import Logo from "assets/images/logo.png";

import { MainMenuItems } from "../data/menuItems";

const { Header } = Layout;

const onClickSectionRegistry = {
  home: (history) => history.push(""),
  "sobre-nos": (history) => history.push("/sobre-nos"),
  produtos: (history) => history.push("/produtos"),
  blog: (history) => history.push("/blog"),
  contactos: (history) => history.push("/contactos"),
};

const buildMenuItemProps = (item) => {
  return {
    key: item.path,
    label: item.label,
  };
};

const PPS_Header = () => {
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [boxShadow, setBoxShadow] = useState("none");
  const [color, setColor] = useState("var(--black)");
  const [sessionKey, setSessionKey] = useState(null);
  const [error, setError] = useState("");
  const history = useHistory();

  const { setSessionKeyAndCartId } = useCart();
  const { updateProductsNr } = useCart();
  const { productsNr } = useCart();
  const { isLoggedIn } = useCart();

  const { clearCartState } = useCart();
  const { setLoggedIn } = useCart();

  const [updateHeader, setUpdateHeader] = useState(false);

  const token = localStorage.getItem("token");
  CreateCartKey(token);

  const location = useLocation();

  const fetchCartId = async (sessionKey) => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/temp_carts?id=${sessionKey}`
      );
      const data = await response.json();
      if (data.length != 0) {
        setSessionKeyAndCartId(sessionKey, data[0].id);
        fetchCartProducts(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCartProducts = async (cartId) => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/temp_cart_products_id?cartId=${cartId}`
      );
      const data = await response.json();

      if (data != undefined) {
        if (data.length == 1) {
          updateProductsNr(data[0].product_qty);
        } else {
          const orderItems = data;
          let totalProductQty = 0;

          for (const orderItem of orderItems) {
            totalProductQty += parseInt(orderItem.product_qty, 10);
          }

          updateProductsNr(totalProductQty);

          setUpdateHeader((prev) => !prev);
        }
      } else {
        updateProductsNr(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // This code will run each time the route changes
    // You can perform any other actions or updates here
    // Make sure to clean up any resources or subscriptions if necessary

    const storedSessionData = getSessionDataFromLocalStorage(isLoggedIn);
    let api_call_count = 0;

    if (storedSessionData) {
      const { key } = storedSessionData;
      setSessionKey(key);
      if (key !== sessionKey) {
        fetchCartId(key);
        setSessionKeyAndCartId(key, null);
      } else {
        api_call_count++;

        if (api_call_count < 1) {
          fetchCartId(key);
        }
      }
    } else {
      const newSessionKey = generateSessionKey();
      setSessionKey(newSessionKey);
      setSessionInLocalStorage(newSessionKey);
    }

    if (location.pathname === "/") {
      setBackgroundColor("transparent");
      setBoxShadow("none");
      setColor("var(--white)");

      const handleScroll = () => {
        const scrollPosition = window.scrollY;

        // You can adjust the scroll threshold as needed
        const threshold = 500;

        // Change the background color based on the scroll position
        if (scrollPosition > threshold) {
          setBackgroundColor("var(--white)");
          setBoxShadow("0px 5px 30px 0px rgba(0, 0, 0, 0.1)");
          setColor("var(--black)");
        } else {
          setBackgroundColor("transparent");
          setBoxShadow("none");
          setColor("var(--white)");
        }
      };

      // Attach the event listener when the component mounts
      window.addEventListener("scroll", handleScroll);

      // Clean up the event listener when the component unmounts
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    } else {
      setBackgroundColor("var(--white)");
      setBoxShadow("0px 5px 30px 0px rgba(0, 0, 0, 0.1)");
      setColor("var(--black)");
    }

    return () => {
      // console.log("Component unmounted or route changed again");
      // Cleanup code here
    };
  }, [
    location,
    setSessionKeyAndCartId,
    updateProductsNr,
    productsNr,
    updateHeader,
  ]);

  const handleLogOut = async () => {
    try {
      await axios.post(
        `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/auth/revoke&JWT=${token}`
      );

      clearCartState();
      setLoggedIn(false);
    } catch (error) {
      setError(error.response.data.message);
      setLoggedIn(false);
      clearCartState();
    }
  };

  return (
    <StyledHeader
      key={updateHeader ? "update" : "no-update"}
      location={location.pathname}
      style={{ backgroundColor, boxShadow }}
    >
      <Col span={6}>
        <StyledLink to="/">
          <img src={Logo} alt="Pet Plushies Logo" />
        </StyledLink>
      </Col>
      <MenuContainer span={18}>
        <StyledMenu
          mode="horizontal"
          overflowedIndicator={<MenuOutlined />}
          items={MainMenuItems.map(buildMenuItemProps)}
          onClick={({ key }) => {
            onClickSectionRegistry[key](history);
          }}
          location={location.pathname}
          style={{ color }}
        />
        <IconLink location={location.pathname} style={{ color }} to="/carrinho">
          <ShoppingCartOutlined />
          {productsNr != 0 && (
            <CartProductsNr>
              <span>{productsNr}</span>
            </CartProductsNr>
          )}
        </IconLink>
        <IconLink
          location={location.pathname}
          style={{ color }}
          to={token != null ? "/minha-conta" : "/login"}
        >
          {isLoggedIn ? <LoggedUserIcon /> : <UserOutlined />}
        </IconLink>
        {isLoggedIn && (
          <LogOutBtn
            location={location.pathname}
            style={{ color }}
            onClick={() => handleLogOut()}
          />
        )}
      </MenuContainer>
    </StyledHeader>
  );
};

const LogOutBtn = styled(LogoutOutlined)`
  cursor: pointer;
  color: ${(props) =>
    props.location == "/" ? "var(--white)" : "var(--black)"};
  transition: 0.5s;

  &:hover {
    color: var(--dark-gray) !important;
  }
`;

const CartProductsNr = styled.div`
  border-radius: 50%;
  background-color: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  margin-left: -7px;
  margin-top: -17px;

  & span {
    color: var(--white);
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
  background-color: ${(props) =>
    props.location == "/" ? "transparent" : "var(--white)"};
  box-shadow: ${(props) =>
    props.location == "/"
      ? "transparent"
      : "0px 5px 30px 0px rgba(0, 0, 0, 0.1)"};
  transition: 0.5s;

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
  color: ${(props) =>
    props.location == "/" ? "var(--white)" : "var(--black)"};
  transition: 0.5s;
  position: relative;

  &:hover {
    color: var(--dark-gray) !important;
  }
`;

const LoggedUserIcon = styled(UserOutlined)`
  transition: 0.5s;
  color: var(--blue);

  &:hover {
    color: var(--dark-gray) !important;
  }
`;

const StyledMenu = styled(Menu)`
  color: ${(props) =>
    props.location == "/" ? "var(--white)" : "var(--black)"};
  transition: 0.5s;
`;

export default PPS_Header;
