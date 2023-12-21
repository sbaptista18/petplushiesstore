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
  const [sessionKey, setSessionKey] = useState(null);
  const history = useHistory();

  const { setSessionKeyAndCartId } = useCart();
  const { updateProductsNr } = useCart();
  const { productsNr } = useCart();

  const [updateHeader, setUpdateHeader] = useState(false);

  CreateCartKey();

  const location = useLocation();

  const fetchCartId = async (sessionKey) => {
    console.log("session key:", sessionKey);
    const options = {
      method: "GET",
      url: `http://localhost:8000/temp_carts/session?id=${sessionKey}`,
    };

    axios
      .request(options)
      .then(function (response) {
        if (response.data.length != 0) {
          setSessionKeyAndCartId(sessionKey, response.data.results[0].id);
          fetchCartProducts(response.data.results[0].id);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchCartProducts = async (cartId) => {
    const options = {
      method: "GET",
      url: `http://localhost:8000/temp_cart_products_id?cartId=${cartId}`,
    };

    axios
      .request(options)
      .then(function (response) {
        if (response.data.results != undefined) {
          if (response.data.results.length == 1) {
            updateProductsNr(response.data.results[0].product_qty);
          } else {
            const orderItems = response.data.results;
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
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    // This code will run each time the route changes
    // You can perform any other actions or updates here
    // Make sure to clean up any resources or subscriptions if necessary
    console.log("Route changed:", location.pathname);

    const storedSessionData = getSessionDataFromLocalStorage();
    let api_call_count = 0;

    console.log("api call count start:", api_call_count);

    if (storedSessionData) {
      const { key } = storedSessionData;
      setSessionKey(key);
      if (key !== sessionKey) {
        fetchCartId(key);
        setSessionKeyAndCartId(key, null);
      } else {
        api_call_count++;

        console.log("api call count:", api_call_count);

        if (api_call_count <= 1) {
          fetchCartId(key);
        }
      }
    } else {
      const newSessionKey = generateSessionKey();
      setSessionKey(newSessionKey);
      setSessionInLocalStorage(newSessionKey);
    }

    return () => {
      console.log("Component unmounted or route changed again");
      // Cleanup code here
    };
  }, [
    location,
    setSessionKeyAndCartId,
    updateProductsNr,
    productsNr,
    updateHeader,
  ]);

  // useEffect(() => {
  //   const fetchCartId = async (sessionKey) => {
  //     const options = {
  //       method: "GET",
  //       url: `http://localhost:8000/temp_carts/session?id=${sessionKey}`,
  //     };

  //     axios
  //       .request(options)
  //       .then(function (response) {
  //         if (response.data.length != 0) {
  //           setSessionKeyAndCartId(sessionKey, response.data.results[0].id);
  //           fetchCartProducts(response.data.results[0].id);
  //         }
  //       })
  //       .catch(function (error) {
  //         console.error(error);
  //       });
  //   };

  //   const storedSessionData = getSessionDataFromLocalStorage();

  //   if (storedSessionData) {
  //     const { key } = storedSessionData;
  //     setSessionKey(key);
  //     if (key !== sessionKey) {
  //       fetchCartId(key);
  //       setSessionKeyAndCartId(key, null);
  //     }
  //   } else {
  //     const newSessionKey = generateSessionKey();
  //     setSessionKey(newSessionKey);
  //     setSessionInLocalStorage(newSessionKey);
  //   }

  //   const fetchCartProducts = async (cartId) => {
  //     const options = {
  //       method: "GET",
  //       url: `http://localhost:8000/temp_cart_products_id?cartId=${cartId}`,
  //     };

  //     axios
  //       .request(options)
  //       .then(function (response) {
  //         if (response.data.results != undefined) {
  //           if (response.data.results.length == 1) {
  //             updateProductsNr(response.data.results[0].product_qty);
  //           } else {
  //             const orderItems = response.data.results;
  //             let totalProductQty = 0;

  //             for (const orderItem of orderItems) {
  //               totalProductQty += parseInt(orderItem.product_qty, 10);
  //             }

  //             updateProductsNr(totalProductQty);

  //             setUpdateHeader((prev) => !prev);
  //           }
  //         } else {
  //           updateProductsNr(0);
  //         }
  //       })
  //       .catch(function (error) {
  //         console.error(error);
  //       });
  //   };
  // }, [setSessionKeyAndCartId, updateProductsNr, productsNr, updateHeader]);

  return (
    <StyledHeader key={updateHeader ? "update" : "no-update"}>
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
        <IconLink
          to={localStorage.getItem("token") != null ? "/minha-conta" : "/login"}
        >
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
