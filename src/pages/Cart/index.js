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
    O carrinho está vazio.
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
  const [totalProductNetRevenue, setTotalProductNetRevenue] = useState(0);

  const { cartId } = useCart();
  const { updateProductsNr } = useCart();

  useEffect(() => {
    if (cartId != null) {
      setLoading(true);
      fetchCartProducts(cartId);
    } else {
      setProductsCart([]);
      setProducts([]);
      setTotalProductNetRevenue(0);
      setLoading(false);
    }
  }, [cartId]);

  // Add this new useEffect
  useEffect(() => {
    if (productsCart.length > 0) {
      const updatedTotal = productsCart.reduce((sum, item) => {
        return sum + parseFloat(item.product_net_revenue, 10);
      }, 0);

      let totalProductQty = 0;

      for (const orderItem of productsCart) {
        totalProductQty += parseInt(orderItem.product_qty, 10);
      }

      updateProductsNr(totalProductQty);
      setTotalProductNetRevenue(updatedTotal);
      setLoading(false); // Set loading to false after calculating the total
    }
  }, [productsCart]);

  const fetchCartProducts = async (cartId) => {
    const options = {
      method: "GET",
      url: `http://localhost:8000/temp_cart_products_id?cartId=${cartId}`,
    };

    try {
      const response = await axios.request(options);

      if (response.data.length != 0) {
        const updatedProducts = await fetchProducts(response.data.results);

        // Calculate total after setting productsCart
        const initialTotal = updatedProducts.reduce((sum, item) => {
          return sum + parseFloat(item.product_net_revenue, 10);
        }, 0);

        setProductsCart(response.data.results);
        setProducts(updatedProducts);
        setTotalProductNetRevenue(initialTotal);
        setLoading(false);
      } else {
        setLoading(false);
        setProductsCart([]);
        setProducts([]);
        setTotalProductNetRevenue(0); // Set total to 0 if there are no products
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async (data) => {
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

    try {
      const responses = await Promise.all(promises);
      const combinedProducts = responses.map(({ cartItem, product }) => {
        return {
          ...cartItem,
          product,
        };
      });
      return combinedProducts;
    } catch (error) {
      setError(true);
      setProducts([]);
      return [];
    }
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
        setMessage("Produto actualizado!");
        setStatus("success");
        setIsModalOpen(true);
      })
      .catch(function (error) {
        setMessage("Houve um erro ao actualizar o produto. (" + error + ".)");
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
        setMessage("Produto apagado do carrinho!");
        setStatus("success");
        setIsModalOpen(true);
      })
      .catch(function (error) {
        setMessage(
          "Houve um erro ao apagar o produto do carrinho. (" + error + ".)"
        );
        setStatus("error");
        setIsModalOpen(true);
      });
  };

  const handleQuantityChange = (
    value,
    recordIndex,
    product_id,
    product_price
  ) => {
    const updatedProducts = [...products];
    updatedProducts[recordIndex].product_qty = value;
    updatedProducts[recordIndex].product_net_revenue = value * product_price;

    setProducts(updatedProducts);

    updateCartProducts(cartId, product_id, value, product_price);

    let totalProductQty = 0;

    for (const orderItem of updatedProducts) {
      totalProductQty += parseInt(orderItem.product_qty, 10);
    }

    updateProductsNr(totalProductQty);

    setProductsCart((prevProductsCart) => {
      const updatedTotal = updatedProducts.reduce((sum, item) => {
        return sum + parseFloat(item.product_net_revenue, 10);
      }, 0);

      setTotalProductNetRevenue((prevTotal) => {
        return updatedTotal;
      });

      return prevProductsCart;
    });
  };

  const handleDelete = (recordIndex, product_id) => {
    const updatedProducts = [...products];
    updatedProducts.splice(recordIndex, 1);

    setProducts(updatedProducts);

    deleteCartProducts(cartId, product_id);

    if (updatedProducts.length > 0) {
      let totalProductQty = 0;

      for (const orderItem of updatedProducts) {
        totalProductQty += parseInt(orderItem.product_qty, 10);
      }
      updateProductsNr(totalProductQty);
    } else updateProductsNr(0);

    setProductsCart((prevProductsCart) => {
      const updatedTotal = updatedProducts.reduce((sum, item) => {
        return sum + parseFloat(item.product_net_revenue, 10);
      }, 0);

      setTotalProductNetRevenue((prevTotal) => {
        return updatedTotal;
      });

      return prevProductsCart;
    });
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
                    <div>Estimativa de portes será feita no próximo passo</div>
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
