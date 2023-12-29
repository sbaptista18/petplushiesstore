import styled from "styled-components";
import { useState, useEffect } from "react";
import { Row, Col, Table, Form, Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";

import { Button, ModalMessage, PageHeader } from "components";
import { tableColumnsCheckout } from "fragments";
import { useCart } from "reducers";

import CheckoutForm from "./form";

import DummyImg from "assets/images/batcat-1.jpg";

const CustomNoData = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    O carrinho esta vazio.
  </div>
);

const Checkout = () => {
  const [createAccount, setCreateAccount] = useState(false);
  const [shipToAddress, setShipToAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { cartId } = useCart();
  const { updateProductsNr } = useCart();
  const [lockForm, setLockForm] = useState(true);
  const [productsCart, setProductsCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingTitle, setShippingTitle] = useState("");
  const [country, setCountry] = useState("");
  const [secondSelectOptions, setSecondSelectOptions] = useState([""]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");
  const [shippingMessage, setShippingMessage] = useState("");
  const [shipMethods, setShipMethods] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState({});
  const [form] = Form.useForm();
  const [form_coupon] = Form.useForm();
  const [userPersonalData, setUserPersonalData] = useState({});
  const [coupon, setCoupon] = useState("");
  const [accountError, setAccountError] = useState("");
  const [orderNote, setOrderNote] = useState(undefined);

  const history = useHistory();

  useEffect(() => {
    // if (cartId == null) history.replace("/carrinho");
    // else
    fetchCartId(cartId);
  }, [cartId]);

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    const user = JSON.parse(storedUserString);

    const fetchCustomerData = async (userId) => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_customer_data?userId=${userId}`
        );
        const responseData = await response.json();
        setUserPersonalData(responseData);
      } catch (error) {
        setError(true);
      }
    };

    if (storedUserString) {
      fetchCustomerData(user.ID);
    }
  }, []);

  const fetchCartId = async (cartId) => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/get_temp_cart_by_id?id=${cartId}`
      );
      const data = await response.json();
      if (data.length != 0) {
        fetchCartProducts(data[0].id);
      } else {
        setLoading(true);
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

      if (data && data.length !== 0) {
        setProductsCart(data);
        setProducts(data);
        setLoading(false);
        setLockForm(false);
      } else {
        setLoading(false);
        setProductsCart([]);
        setProducts([]);
      }
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };

  const calculateShippingCost = (data, subtotal) => {
    if (subtotal > 50) {
      setShippingTitle("Portes Gratuitos");
      return 0;
    }

    const zoneMethods = data.zone_methods;

    for (const methodKey in zoneMethods) {
      const method = zoneMethods[methodKey];

      setShippingTitle(method.title);

      if (method) {
        const cost = parseFloat(method.cost);
        return cost;
      }
    }

    return null;
  };

  const fetchShippingZonesDetails = async (area) => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/get_shipping_zones_by_country_code?country_code=${area}`
      );
      const data = await response.json();

      if (data.success) {
        const weightGrs = totalWeight * 1000;
        const shippingCost = calculateShippingCost(
          data.zones[0],
          weightGrs,
          totalProductNetRevenue
        );

        setShippingMessage("");
        setShipMethods(true);
        setShippingCost(shippingCost);
      } else {
        setShippingMessage("Não há métodos de envio associados a este país.");
        setShipMethods(false);
      }
    } catch (error) {
      // setError(true);
    }
  };

  const fetchCoupon = async () => {
    const couponCode = form_coupon.getFieldsValue().coupon_code;
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/get_coupon?coupon_code=${couponCode}`
      );
      const data = await response.json();

      if (data.success) {
        setCoupon(data.coupon);
      } else {
        setMessage(data.message);
        setStatus("error");
        setIsModalOpen(true);
      }
    } catch (error) {
      setMessage("Houve um erro na verificação do cupão. Tente novamente.");
      setStatus("error");
      setIsModalOpen(true);
    }
  };

  const totalProductNetRevenue = productsCart.reduce((sum, item) => {
    return sum + parseFloat(item.product_gross_revenue);
  }, 0);

  const handleCheckCreateAccount = () => {
    setCreateAccount((prevState) => !prevState);
  };

  const handleCheckShipAddress = () => {
    setShipToAddress((prevState) => !prevState);
  };

  const formatMetaFromExtras = (productExtras) => {
    if (!productExtras) return "";

    const cleanedString = productExtras.replace(/<\/?b>/gi, "");
    const keyValuePairs = cleanedString.split(";").map((pair) => pair.trim());
    const resultObject = {};

    keyValuePairs.forEach((pair) => {
      const [rawKey, value] = pair.split(":");
      if (rawKey && value) {
        const key = rawKey.trim();
        resultObject[key] = value.trim();
      }
    });

    return Object.keys(resultObject).map((key) => ({
      key,
      value: resultObject[key],
    }));
  };

  const buildBillingDetails = (formValues) => ({
    first_name: formValues.first_name,
    last_name: formValues.surname,
    company: formValues.company !== "" ? formValues.company : "",
    address_1: formValues.address,
    address_2: "",
    city: formValues.local,
    state: formValues.district,
    postcode: formValues.postcode,
    country: formValues.country,
    email: formValues.email,
    phone: formValues.phone,
  });

  const buildShippingDetails = (formValues) => ({
    first_name: formValues.first_name_other || formValues.first_name,
    last_name: formValues.surname_other || formValues.surname,
    company: formValues.company !== "" ? formValues.company : "",
    address_1: formValues.address_other || formValues.address,
    address_2: "",
    city: formValues.local_other || formValues.local,
    state: formValues.district_other || formValues.district,
    postcode: formValues.postcode_other || formValues.postcode,
    country: formValues.country_other,
  });

  const buildOrderData = (cartId, formValues, userId, orderId, coupon_code) => {
    const commonOrderData = {
      cart_id: cartId,
      payment_method: paymentMethod.value,
      payment_method_title: paymentMethod.label,
      set_paid: paymentMethod.label == "PayPal" ? true : false,
      status: paymentMethod.label == "PayPal" ? "processing" : "on-hold",
      customer_id: userId,
      transaction_id: orderId !== undefined ? orderId : "",
      prices_include_tax: true,
      billing: buildBillingDetails(formValues),
      shipping: buildShippingDetails(formValues),
      line_items: products.map((p) => {
        return {
          product_id: p.product_id,
          quantity: p.product_qty,
          total: parseFloat(p.product_gross_revenue).toFixed(2),
          total_tax: p.tax_amount,
          meta_data: formatMetaFromExtras(p.product_extras),
          tax_class: "",
        };
      }),
      shipping_lines: [
        {
          method_id:
            shippingCost.toString() == 0 ? "free_shipping" : "flat_rate",
          method_title: shippingTitle,
          total: shippingCost.toString(),
        },
      ],
      coupon_code: coupon_code,
      customer_note: orderNote,
    };

    return formValues.first_name_other
      ? { ...commonOrderData, shipping: buildShippingDetails(formValues) }
      : commonOrderData;
  };

  const createCustomer = async (formValues) => {
    const dataCustomer = {
      email: formValues.email,
      first_name: formValues.first_name,
      last_name: formValues.surname,
      username: `${formValues.first_name.toLowerCase()}.${formValues.surname.toLowerCase()}`,
      billing: buildBillingDetails(formValues),
      shipping: buildShippingDetails(formValues),
      is_paying_customer: true,
    };

    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/wc/v3/create_customer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataCustomer }),
        }
      );
      const data = await response.json();

      if (data.error) {
        setAccountError(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createOrder = async (dataOrder, createAccount, formValues) => {
    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/wc/v3/create_order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataOrder }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setMessage(response.message);
        setStatus("success");
        setIsModalOpen(true);

        updateProductsNr(0);
        setProductsCart([]);
        setProducts([]);

        if (createAccount) {
          createCustomer(formValues)
            .then(function (response) {
              setMessage(
                "A sua conta foi criada com sucesso! Pode efetuar o login com o seu nome de utilizador gerado (" +
                  formValues.first_name.toLowerCase() +
                  "." +
                  formValues.surname.toLowerCase() +
                  "). Receberá instruções para definir a sua password."
              );
              setStatus("success");
              setIsModalOpen(true);
              setTimeout(() => {
                history.replace("/");
              }, 5000);
            })
            .catch(function (error) {
              setMessage(
                "Houve um erro na criação da conta. Por favor envie e-mail para geral@petplushies.pt para notificar do sucedido. (" +
                  error.response.data +
                  ")."
              );
              setStatus("error");
              setIsModalOpen(true);
            });
        } else {
          if (response.success) {
            setMessage(response.message);
            setStatus("success");
            setIsModalOpen(true);
            setTimeout(() => {
              history.replace("/");
            }, 5000);
          } else {
            setMessage(response.message);
            setStatus("error");
            setIsModalOpen(true);
          }
        }
      } else {
        setMessage(response.message);
        setStatus("error");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlaceOrder = (orderId) => {
    form
      .validateFields()
      .then(() => {
        const formValues = form.getFieldsValue();
        const userId = localStorage.getItem("user")
          ? parseInt(JSON.parse(localStorage.getItem("user")).ID)
          : 0;

        const dataOrder = buildOrderData(
          cartId,
          formValues,
          userId,
          orderId,
          coupon.coupon_code
        );

        createOrder(dataOrder, createAccount, formValues);
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
        setMessage("Tem de preencher todos os campos obrigatórios.");
        setStatus("error");
        setIsModalOpen(true);
      });
  };

  const totalWeight = products.reduce((total, item) => {
    const productQty = parseInt(item.product_qty, 10);
    const productWeight = parseFloat(item.weight);
    const itemWeight = productQty * productWeight;

    return total + itemWeight;
  }, 0);

  const handleOrderNote = (e) => {
    setOrderNote(e.target.value);
  };

  const handleCountry = (value) => {
    fetchShippingZonesDetails(value);
    setCountry(value);
    setSecondSelectOptions(value);
  };

  const handleCountryShipping = (value) => {
    fetchShippingZonesDetails(value);
    setCountry(value);
    setSecondSelectOptions(value);
  };

  const handlePaymentMethod = (paymentMethod) => {
    const selectedValue = paymentMethod.value;
    const selectedLabel = paymentMethod.label;

    setPaymentMethod({ label: selectedLabel, value: selectedValue });
  };

  const handleOnPayPalSuccess = (details, data) => {
    console.log("Transaction completed by " + details.payer.name.given_name);
    handlePlaceOrder(data.orderID);
  };

  const handleOnPayPalError = (err) => {
    console.error("Transaction failed:", err);
    setMessage("Erro na transacção.");
    setStatus("error");
    setIsModalOpen(true);
  };

  const handleOnPayPalCancel = (data) => {
    console.log("Transaction canceled:", data);
    setMessage("Transacção cancelada.");
    setStatus("error");
    setIsModalOpen(true);
  };

  const handleFinalPrice = (coupon) => {
    if (coupon !== "") {
      if (coupon.discount_type === "fixed_cart") {
        return (totalProductNetRevenue + shippingCost - coupon.amount).toFixed(
          2
        );
      } else {
        return (
          totalProductNetRevenue +
          shippingCost -
          (totalProductNetRevenue + shippingCost) * coupon.amount
        ).toFixed(2);
      }
    } else {
      return (totalProductNetRevenue + shippingCost).toFixed(2);
    }
  };

  return (
    <>
      <PageHeader
        title="Finalizar Compra"
        img={DummyImg}
        alt="Finalizar Compra - Pet Plushies"
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
            <Col span={12}>
              <div>
                <CheckoutForm
                  disabled={lockForm}
                  form={form}
                  handleCountry={handleCountry}
                  handleCheckCreateAccount={handleCheckCreateAccount}
                  createAccount={createAccount}
                  handleCheckShipAddress={handleCheckShipAddress}
                  shipToAddress={shipToAddress}
                  handleCountryShipping={handleCountryShipping}
                  country={country}
                  secondSelectOptions={secondSelectOptions}
                  handlePaymentMethod={handlePaymentMethod}
                  paymentMethod={paymentMethod}
                  data={userPersonalData}
                  accountError={accountError}
                  handleOrderNote={handleOrderNote}
                  orderNote={orderNote}
                />
              </div>
            </Col>
            <Col span={11}>
              <Title>O meu carrinho</Title>
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
                  <StyledTable
                    columns={tableColumnsCheckout}
                    dataSource={products}
                    pagination={false}
                    rowKey="product_id"
                    locale={{ emptyText: <CustomNoData /> }}
                  />
                )}
              </div>

              <Title>Resumo da compra</Title>
              <Border />
              <Subtotal>
                <div>Subtotal</div>
                <div>{totalProductNetRevenue.toFixed(2)}&euro;</div>
              </Subtotal>
              <Shipping>
                <div>Estimativa de portes</div>
                {shippingMessage != "" ? (
                  <div>{shippingMessage}</div>
                ) : (
                  <div>
                    {shippingTitle != "" && <>{`${shippingTitle}: `}</>}
                    <>{shippingCost.toFixed(2)}&euro;</>
                  </div>
                )}
              </Shipping>
              <Form
                form={form_coupon}
                name="coupon"
                labelCol={{
                  span: 5,
                }}
                wrapperCol={{
                  span: 19,
                }}
              >
                <Form.Item name="coupon_code" label="Codigo promocional">
                  <Input />
                </Form.Item>
                <Form.Item
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    size="small"
                    type="primary"
                    text="Aplicar cupão"
                    onClick={() => fetchCoupon()}
                  />
                </Form.Item>
              </Form>
              {coupon != "" && (
                <Shipping>
                  <div>Desconto do cupao</div>
                  <div>
                    {coupon.discount_type === "fixed_cart"
                      ? coupon.amount
                      : (
                          (totalProductNetRevenue + shippingCost) *
                          coupon.amount
                        ).toFixed(2)}
                    &euro;
                  </div>
                </Shipping>
              )}
              <Border />
              <Total>
                <div>Total</div>
                <div>{handleFinalPrice(coupon)}&euro;</div>
              </Total>
              {paymentMethod.label == "PayPal" ? (
                <PayPalButton
                  amount={handleFinalPrice(coupon)} // Set your transaction amount
                  onSuccess={handleOnPayPalSuccess}
                  onError={handleOnPayPalError}
                  onCancel={handleOnPayPalCancel}
                  options={{
                    clientId:
                      "AS_49gaJ4KOHzPP5mOgS3Ih58UojUfWU08_gj6GuMEZRMShDfNjY_JDbjVogZZcTrLqzAjWde_OxTxKk", //change this to the Production Code when deploying to online site
                    currency: "EUR", // Set your currency
                  }}
                />
              ) : (
                <StyledButton
                  size="large"
                  type="primary"
                  text="Finalizar encomenda"
                  disabled={!shipMethods}
                  onClick={() => handlePlaceOrder()}
                />
              )}
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

const StyledH1 = styled.h1`
  margin-top: 30px;
  font-size: 52px;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
  margin-top: 50px;
`;

const StyledTable = styled(Table)`
  && {
    & .ant-table-thead > tr > th {
      background-color: transparent;
      border-color: var(--black);

      &:before {
        display: none;
      }
    }

    & .ant-table-row {
      height: 100px;
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
  path: "/finalizar-compra",
  exact: true,
  component: Checkout,
};
