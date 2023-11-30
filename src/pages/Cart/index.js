import styled from "styled-components";
import { Row, Col, Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button, ModalMessage } from "components";
import { ConnectWC, tableColumns } from "fragments";
import { useCart } from "reducers";

const CustomNoData = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    O carrinho esta vazio.
  </div>
);

const Cart = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { cartId } = useCart();
  const [productsCart, setProductsCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCartId(cartId);
  }, [cartId]);

  const fetchCartId = async (cartId) => {
    ConnectWC.get("temp_carts")
      .then((data) => {
        const cartLocalSession = data.success.find(
          (cart) => cart.id === cartId
        );
        if (cartLocalSession !== undefined) {
          fetchCartProducts(cartLocalSession.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        setError(true);
      });
  };

  const fetchCartProducts = async (cartId) => {
    ConnectWC.get("temp_cart_products_id/" + cartId)
      .then((data) => {
        if (data.results.length > 0) {
          setProductsCart(data.results);
          fetchProducts(data.results);
        } else {
          setProductsCart([]);
          setProducts([]); // Make sure to set products state to an empty array if there are no cart products
        }
      })
      .catch((error) => {
        setError(true);
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

    ConnectWC.post("temp_cart_products_checkout", dataProduct)
      .then((response) => {
        setMessage("Product updated!");
        setStatus("success");
        setIsModalOpen(true);
      })
      .catch((error) => {
        setMessage("There was an error updating the product. (" + error + ".)");
        setStatus("error");
        setIsModalOpen(true);
      });
  };

  const deleteCartProducts = (cartId, product_id) => {
    const dataProduct = {
      temp_cart_id: cartId,
      product_id: product_id,
    };

    ConnectWC.delete(
      "temp_cart_products_delete/" +
        dataProduct.temp_cart_id +
        "/" +
        dataProduct.product_id
    )
      .then((response) => {
        setMessage("Product deleted from cart!");
        setStatus("success");
        setIsModalOpen(true);
      })
      .catch((error) => {
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
