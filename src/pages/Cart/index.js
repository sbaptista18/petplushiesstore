import styled from "styled-components";
import { Row, Col, Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { Button, ModalMessage } from "components";
import { tableColumns } from "fragments";
import { useCart } from "reducers";

const CustomNoData = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    O carrinho esta vazio.
  </div>
);

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productsCart, setProductsCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  const { cartId } = useCart();

  useEffect(() => {
    fetchCartId(cartId);
  }, [cartId]);

  const fetchCartId = async (cartId) => {
    const options = {
      method: "GET",
      url: `http://localhost:8000/temp_carts/id?id=${cartId}`,
    };

    axios
      .request(options)
      .then(function (response) {
        if (response.data.results != undefined) {
          fetchCartProducts(response.data.results[0].id);
        } else {
          setLoading(true);
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
        if (response.data.results.length > 0) {
          setProductsCart(response.data.results);
          fetchProducts(response.data.results);
        } else {
          setProductsCart([]);
          setProducts([]);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const fetchProducts = (data) => {
    const promises = data.map((cartItem) => {
      const options = {
        method: "GET",
        url: `http://localhost:8000/products/id?id=${cartItem.product_id}`,
      };

      return axios
        .request(options)
        .then((response) => {
          let product = response.data;
          return { cartItem, product };
        })
        .catch(function (error) {
          return { error: error.response.data };
        });
    });

    Promise.all(promises)
      .then((responses) => {
        const combinedProducts = responses.map(({ cartItem, product }) => ({
          ...cartItem,
          product,
        }));

        setProductsCart(data);
        setProducts(combinedProducts);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setProducts([]);
      });
  };

  const updateCartProducts = (cartId, product_id, qty, product_price) => {
    const dataProduct = {
      temp_cart_id: cartId,
      product_id: product_id,
      date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
      product_qty: qty,
      product_net_revenue: product_price * qty,
    };

    const options = {
      method: "POST",
      url: `http://localhost:8000/temp_cart_products_id`,
      data: JSON.stringify({ dataProduct }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        setMessage("Product updated!");
        setStatus("success");
        setIsModalOpen(true);
      })
      .catch(function (error) {
        setMessage("There was an error updating the product. (" + error + ".)");
        setStatus("error");
        setIsModalOpen(true);
      });
  };

  const deleteCartProducts = (cartId, product_id) => {
    const options = {
      method: "DELETE",
      url: `http://localhost:8000/temp_cart_products_delete?cartId=${cartId}&prodId=${product_id}`,
    };

    axios
      .request(options)
      .then(function (response) {
        setMessage("Product deleted from cart!");
        setStatus("success");
        setIsModalOpen(true);
      })
      .catch(function (error) {
        setMessage(
          "There was an error deleting the product from the cart. (" +
            error +
            ".)"
        );
        setStatus("error");
        setIsModalOpen(true);
      });
  };

  const totalProductNetRevenue = productsCart.reduce((sum, item) => {
    return sum + parseInt(item.product_net_revenue, 10);
  }, 0);

  const handleQuantityChange = (
    value,
    recordIndex,
    product_id,
    product_price
  ) => {
    // Do something with the changed value, e.g., update your data state
    const updatedProducts = [...products];
    updatedProducts[recordIndex].product_qty = value;
    updatedProducts[recordIndex].product_net_revenue = value * product_price;

    setProducts(updatedProducts);
    updateCartProducts(cartId, product_id, value, product_price);
  };

  const handleDelete = (recordIndex, product_id) => {
    // Create a copy of the products array
    const updatedProducts = [...products];

    // Remove the item at the specified index
    updatedProducts.splice(recordIndex, 1);

    // Update the state or whatever mechanism you are using to manage the products
    setProducts(updatedProducts);
    deleteCartProducts(cartId, product_id);
  };

  return (
    <Container>
      <ModalMessage
        status={status}
        message={message}
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ContentLocked>
        <StyledH1>Carrinho</StyledH1>
        <StyledRow>
          <Col span={15}>
            <Title>O meu carrinho</Title>
            <Border />
            <div style={{ position: "relative" }}>
              {loading && !error && (
                <Spinner
                  indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
                />
              )}
              {!loading && !error && (
                <StyledTable
                  columns={tableColumns(handleQuantityChange, handleDelete)}
                  dataSource={products}
                  pagination={false}
                  rowKey="product_id"
                  locale={{ emptyText: <CustomNoData /> }}
                />
              )}
            </div>
          </Col>
          <Col span={5}>
            <Title>Resumo da compra</Title>
            <Border />
            <div style={{ position: "relative" }}>
              {loading && !error && (
                <Spinner
                  indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
                />
              )}
              {!loading && !error && (
                <>
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
                </>
              )}
            </div>
          </Col>
        </StyledRow>
      </ContentLocked>
    </Container>
  );
};

const Spinner = styled(Spin)`
  position: absolute;
  background-color: white;
  width: 100%;
  height: 500px;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
    & .ant-table-empty {
      text-align: center;
    }
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
