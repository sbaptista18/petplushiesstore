import styled from "styled-components";
import { Row, Col, Table } from "antd";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "components";
import { ConnectWC } from "fragments";
import { useCart } from "reducers";

import table_render from "./table_render";

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const { cartId } = useCart();
  const [productsCart, setProductsCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (cartId === null) {
      setLoading(true);
    } else {
      setLoading(false);
      fetchCartId(cartId);
    }
  }, [cartId]);

  const fetchCartId = async (cartId) => {
    ConnectWC.get("temp_carts")
      .then((data) => {
        const cartLocalSession = data.success.find(
          (cart) => cart.id === cartId
        );
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
          setProductsCart(data.success);
          fetchProducts(data.success);
        } else {
          setProductsCart([]);
          setProducts([]); // Make sure to set products state to an empty array if there are no cart products
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchProducts = (data) => {
    const promises = data.map((cartItem) => {
      return ConnectWC.get("products/" + cartItem.product_id)
        .then((product) => ({ cartItem, product })) // Combine cart item and product data
        .catch((error) => {
          // Assuming you want to handle errors and continue
          return { error: error.response.data };
        });
    });

    Promise.all(promises)
      .then((responses) => {
        // Extract cartItem and product data from the responses
        const combinedProducts = responses.map(({ cartItem, product }) => ({
          ...cartItem,
          product,
        }));
        setProductsCart(data); // Set productsCart separately
        setProducts(combinedProducts); // Set combinedProducts to products state
        // Do something with the array of responses
      })
      .catch((error) => {
        setProducts([]);
      });
  };

  const totalProductNetRevenue = productsCart.reduce((sum, item) => {
    return sum + parseInt(item.product_net_revenue, 10);
  }, 0);

  return (
    <Container>
      <ContentLocked>
        <StyledH1>Carrinho</StyledH1>
        <StyledRow>
          <Col span={15}>
            <Title>O meu carrinho</Title>
            <Border />
            <StyledTable
              columns={table_render}
              dataSource={products}
              pagination={false}
              rowKey="product_id"
            />
          </Col>
          <Col span={5}>
            <Title>Resumo da compra</Title>
            <Border />
            <Subtotal>
              <div>Subtotal</div>
              <div>{totalProductNetRevenue}&euro;</div>
            </Subtotal>
            <Shipping>
              <div>Estimativa de portes sera feita no proximo passo</div>
              <div></div>
            </Shipping>
            <Border />
            <Total>
              <div>Subtotal</div>
              <div>{totalProductNetRevenue}&euro;</div>
            </Total>
            <Link to="/finalizar-compra">
              <StyledButton
                size="large"
                type="primary"
                text="Finalizar compra"
              />
            </Link>
          </Col>
        </StyledRow>
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
  margin-bottom: 50px;
`;

const StyledH1 = styled.h1`
  position: absolute;
  left: -200%;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
  margin-top: 50px;
`;

const StyledTable = styled(Table)`
  && {
    & .ant-table-thead > tr > th {
      background-color: transparent;
      border-color: black;

      &:before {
        display: none;
      }
    }

    & .ant-table-row {
      height: 200px;
    }

    & .ant-table-cell {
      border-color: black;
    }
  }
`;

const Title = styled.p`
  font-size: 19px;
`;

const Border = styled.div`
  height: 1px;
  width: 100%;
  background-color: black;
  margin-bottom: 30px;
`;

const Subtotal = styled(Row)`
  justify-content: space-between;
`;

const Shipping = styled(Subtotal)``;

const Total = styled(Subtotal)`
  font-size: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

export default {
  path: "/carrinho",
  exact: true,
  component: Cart,
};
