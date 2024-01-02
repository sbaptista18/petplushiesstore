import styled from "styled-components";
import { Row, Col, Table, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button, ModalMessage, PageHeader } from "components";
import { tableColumns } from "fragments";
import { useCart } from "reducers";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const calculateTotalNetRevenue = (items) => {
    return items.reduce(
      (sum, item) => sum + parseFloat(item.product_gross_revenue, 10),
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
      setLoading(false);
    }
  }, [productsCart]);

  const fetchCartProducts = async (cartId) => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/temp_cart_products_id?cartId=${cartId}`
      );
      const data = await response.json();

      if (data && data.length !== 0) {
        const initialTotal = calculateTotalNetRevenue(data);

        setProductsCart(data);
        setProducts(data);
        setTotalProductNetRevenue(initialTotal);
        setLoading(false);
      } else {
        setLoading(false);
        setProductsCart([]);
        setProducts([]);
        setTotalProductNetRevenue(0);
      }
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };

  const updateCartProducts = async (
    cartId,
    product_id,
    qty,
    product_gross_revenue,
    product_net_revenue,
    tax_amount
  ) => {
    const dataProduct = {
      temp_cart_id: cartId,
      product_id: product_id,
      date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
      product_qty: qty,
      product_net_revenue: product_net_revenue,
      product_gross_revenue: product_gross_revenue,
      tax_amount: tax_amount,
    };

    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/wc/v3/update_cart_product",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataProduct }),
        }
      );
      const responseData = await response.json();
      setMessage(responseData.message);
      setStatus("success");
      setIsModalOpen(true);
    } catch (error) {
      setMessage(responseData.message);
      setStatus("error");
      setIsModalOpen(true);
    }
  };

  const deleteCartProducts = async (cartId, product_id) => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/delete_cart_product?cartId=${cartId}&prodId=${product_id}`,
        {
          method: "DELETE",
        }
      );

      const responseData = await response.json();
      setMessage(responseData.message);
      setStatus("success");
      setIsModalOpen(true);
    } catch (error) {
      setMessage(responseData.message);
      setStatus("error");
      setIsModalOpen(true);
    }
  };

  const handleQuantityChange = (
    value,
    recordIndex,
    product_id,
    unit_gross_revenue,
    unit_net_revenue,
    unit_tax_amount
  ) => {
    const updatedProducts = [...products];
    updatedProducts[recordIndex].product_qty = value;
    updatedProducts[recordIndex].product_gross_revenue =
      value * unit_gross_revenue;
    updatedProducts[recordIndex].product_net_revenue = value * unit_net_revenue;
    updatedProducts[recordIndex].tax_amount = value * unit_tax_amount;

    let totalProductQty = 0;

    for (const orderItem of updatedProducts) {
      totalProductQty += parseInt(orderItem.product_qty, 10);
    }

    setProducts(updatedProducts);

    updateCartProducts(
      cartId,
      product_id,
      value,
      value * unit_gross_revenue,
      value * unit_net_revenue,
      value * unit_tax_amount
    );

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
      updateProductsNr(totalProductQty);
    } else {
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
        title={t("meuCarrinho")}
        img={DummyImg}
        alt={`${t("meuCarrinho")} - Pet Plushies`}
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
                    columns={tableColumns(
                      handleQuantityChange,
                      handleDelete,
                      t
                    )}
                    dataSource={products}
                    pagination={false}
                    rowKey="id"
                    locale={{ emptyText: <CustomNoData /> }}
                  />
                )}
              </div>
            </Col>
            <Col span={5}>
              <Title>{t("resumoCompra")}</Title>
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
                      <div>{totalProductNetRevenue.toFixed(2)}&euro;</div>
                    </Subtotal>
                    <Shipping>
                      <div>{t("estimativaPortes")}</div>
                      <div></div>
                    </Shipping>
                    <Border />
                    <Total>
                      <div>Subtotal</div>
                      <div>{totalProductNetRevenue.toFixed(2)}&euro;</div>
                    </Total>
                    <Link to="/finalizar-compra">
                      <StyledButton
                        size="large"
                        type="primary"
                        text={t("finalizarCompra")}
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
  background-color: var(--white);
  width: 100%;
  height: 450px;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
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
      border-color: var(--black);

      &:before {
        display: none;
      }
    }

    & .ant-table-row {
      height: 200px;
    }

    & .ant-table-cell {
      border-color: var(--black);
    }
  }
`;

const Title = styled.p`
  font-size: 19px;
`;

const Border = styled.div`
  height: 1px;
  width: 100%;
  background-color: var(--black);
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
