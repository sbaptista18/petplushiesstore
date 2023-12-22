import styled from "styled-components";
import { Row, Col, Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

import { Button, ModalMessage, PageHeader } from "components";
import { tableColumns } from "fragments";
import { useCart } from "reducers";

import DummyImg from "assets/images/batcat-1.jpg";

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

  const axiosRequest = async (method, url, data = null) => {
    const options = {
      method,
      url,
      data: data ? JSON.stringify(data) : null,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const calculateTotalNetRevenue = (items) => {
    return items.reduce(
      (sum, item) => sum + parseFloat(item.product_net_revenue, 10),
      0
    );
  };

  useEffect(() => {
    if (cartId !== null) {
      fetchCartProducts(cartId);
      setLoading(true);
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
      const updatedTotal = calculateTotalNetRevenue(productsCart);

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
    const url = `http://localhost:8000/temp_cart_products_id?cartId=${cartId}`;

    const response = await axiosRequest("GET", url);

    if (response && response.length !== 0) {
      const updatedProducts = await fetchProducts(response.results);

      const initialTotal = calculateTotalNetRevenue(updatedProducts);

      setProductsCart(response.results);
      setProducts(updatedProducts);
      setTotalProductNetRevenue(initialTotal);
      setLoading(false);
    } else {
      setLoading(false);
      setProductsCart([]);
      setProducts([]);
      setTotalProductNetRevenue(0);
    }
  };

  const fetchProducts = async (data) => {
    const promises = data.map((cartItem) => {
      const url = `http://localhost:8000/products/id?id=${cartItem.product_id}`;
      return axiosRequest("GET", url)
        .then((response) => ({ cartItem, product: response }))
        .catch((error) => ({ error: error.response.data }));
    });

    try {
      const responses = await Promise.all(promises);
      const combinedProducts = responses.map(({ cartItem, product }) => ({
        ...cartItem,
        product,
      }));
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

    const url = `http://localhost:8000/temp_cart_products_id`;

    axiosRequest("POST", url, { dataProduct })
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

    let totalProductQty = 0;

    for (const orderItem of updatedProducts) {
      totalProductQty += parseInt(orderItem.product_qty, 10);
    }

    setProducts(updatedProducts);

    updateCartProducts(cartId, product_id, value, product_price);

    updateProductsNr(totalProductQty);

    setProductsCart((prevProductsCart) => {
      const updatedTotal = calculateTotalNetRevenue(updatedProducts);

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
      // console.log("total prod qty:", totalProductQty);
      updateProductsNr(totalProductQty);
    } else {
      // console.log(updatedProducts.length);
      updateProductsNr(0);
    }

    setProductsCart((prevProductsCart) => {
      const updatedTotal = calculateTotalNetRevenue(updatedProducts);

      setTotalProductNetRevenue((prevTotal) => {
        return updatedTotal;
      });

      return prevProductsCart;
    });
  };

  return (
    <>
      <PageHeader
        title="Carrinho"
        img={DummyImg}
        alt="Carrinho - Pet Plusies"
      />
      <Container>
        <ModalMessage
          status={status}
          message={message}
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <ContentLocked>
          <StyledRow>
            <Col span={15}>
              <div style={{ position: "relative" }}>
                {loading && !error && (
                  <Spinner
                    indicator={
                      <LoadingOutlined style={{ fontSize: 50 }} spin />
                    }
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
                    indicator={
                      <LoadingOutlined style={{ fontSize: 50 }} spin />
                    }
                  />
                )}
                {!loading && !error && (
                  <>
                    <Subtotal>
                      <div>Subtotal</div>
                      <div>{totalProductNetRevenue}&euro;</div>
                    </Subtotal>
                    <Shipping>
                      <div>
                        Estimativa de portes será feita no próximo passo
                      </div>
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
    </>
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
  background-color: white;
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

const StyledRow = styled(Row)`
  justify-content: space-between;
  margin-top: 50px;
  min-height: 500px;
`;

const StyledTable = styled(Table)`
  && {
    margin-bottom: 50px;
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
