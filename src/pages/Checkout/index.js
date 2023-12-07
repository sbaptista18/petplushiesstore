import styled from "styled-components";
import { useState, useEffect } from "react";
import { Row, Col, Table, Form, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import axios from "axios";

import { Button, ModalMessage } from "components";
import { tableColumnsCheckout } from "fragments";
import { useCart } from "reducers";

import CheckoutForm from "./form";
import { PortugalDistricts } from "./data";

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
  const [productsCart, setProductsCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingTitle, setShippingTitle] = useState("");
  const [country, setCountry] = useState("");
  const [secondSelectOptions, setSecondSelectOptions] = useState([""]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState({});
  const [form] = Form.useForm();
  const [userPersonalData, setUserPersonalData] = useState({});

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
      const options = {
        method: "GET",
        url: `http://localhost:8000/customers?userId=${userId}`,
      };

      axios
        .request(options)
        .then(function (response) {
          setUserPersonalData(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    if (storedUserString) {
      fetchCustomerData(user.ID);
    }
  }, []);

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

  const calculateShippingCost = (data, weight, subtotal) => {
    if (subtotal > 50) {
      return 0;
    }

    const method = data.find((shippingMethod) => {
      const title = shippingMethod.title.toLowerCase();
      const match = title.match(/(\d+)\s*g\s*a\s*(\d+)?/);

      setShippingTitle(shippingMethod.title);

      if (match) {
        const minWeight = parseInt(match[1]);
        const maxWeight = match[2] ? parseInt(match[2]) : undefined;

        return (
          weight >= minWeight &&
          (maxWeight === undefined || weight <= maxWeight)
        );
      }

      return false;
    });

    if (method) {
      const cost = parseFloat(method.settings.cost.value);
      return cost;
    } else {
      return null;
    }
  };

  const fetchShippingZonesDetails = async (area) => {
    const options = {
      method: "GET",
      url: `http://localhost:8000/shipping?area=${area}`,
    };

    return axios
      .request(options)
      .then((response) => {
        const weightGrs = totalWeight * 1000;
        const shippingCost = calculateShippingCost(
          response.data,
          weightGrs,
          totalProductNetRevenue
        );

        setShippingCost(shippingCost);
      })
      .catch(function (error) {
        setError(true);
      });
  };

  const totalProductNetRevenue = productsCart.reduce((sum, item) => {
    return sum + parseInt(item.product_net_revenue, 10);
  }, 0);

  const handleCheckCreateAccount = () => {
    setCreateAccount((prevState) => !prevState);
  };

  const handleCheckShipAddress = () => {
    setShipToAddress((prevState) => !prevState);
  };

  const handlePlaceOrder = (orderId) => {
    form
      .validateFields()
      .then(() => {
        const formValues = form.getFieldsValue();

        const userLocalStorageData = localStorage.getItem("user");
        let userId;

        if (userLocalStorageData)
          userId = parseInt(JSON.parse(localStorage.getItem("user")).ID);
        else userId = 0;

        let dataOrder;

        if (formValues.first_name_other) {
          dataOrder = {
            payment_method: paymentMethod.value,
            payment_method_title: paymentMethod.label,
            set_paid: paymentMethod.label == "PayPal" ? true : false,
            status: paymentMethod.label == "PayPal" ? "processing" : "on-hold",
            customer_id: userId,
            transaction_id: orderId != undefined ? orderId : "",
            billing: {
              first_name: formValues.first_name,
              last_name: formValues.surname,
              company: formValues.company !== "" ? formValues.company : "",
              address_1: formValues.address,
              address_2: "",
              city: formValues.local,
              state: formValues.district,
              postcode: formValues.postcode,
              country: formValues.country == 2 ? "PT" : "",
              email: formValues.email,
              phone: formValues.phone,
            },
            shipping: {
              first_name: formValues.first_name_other,
              last_name: formValues.surname_other,
              company: formValues.company !== "" ? formValues.company : "",
              address_1: formValues.address_other,
              address_2: "",
              city: formValues.local_other,
              state: formValues.district_other,
              postcode: formValues.postcode_other,
              country: formValues.country_other == 2 ? "PT" : "",
            },
            line_items: products.map((p) => ({
              product_id: p.product_id,
              quantity: p.product_qty,
            })),
            shipping_lines: [
              {
                method_id: "flat_rate",
                method_title: shippingTitle,
                total: shippingCost.toString(),
              },
            ],
          };
        } else {
          dataOrder = {
            payment_method: paymentMethod.value,
            payment_method_title: paymentMethod.label,
            set_paid: paymentMethod.label == "PayPal" ? true : false,
            status: paymentMethod.label == "PayPal" ? "processing" : "on-hold",
            customer_id: userId,
            transaction_id: orderId != undefined ? orderId : "",
            billing: {
              first_name: formValues.first_name,
              last_name: formValues.surname,
              company: formValues.company !== "" ? formValues.company : "",
              address_1: formValues.address,
              address_2: "",
              city: formValues.local,
              state: formValues.district,
              postcode: formValues.postcode,
              country: formValues.country == 2 ? "PT" : "",
              email: formValues.email,
              phone: formValues.phone,
            },
            shipping: {
              first_name: formValues.first_name,
              last_name: formValues.surname,
              company: formValues.company !== "" ? formValues.company : "",
              address_1: formValues.address,
              address_2: "",
              city: formValues.local,
              state: formValues.district,
              postcode: formValues.postcode,
              country: formValues.country == 2 ? "PT" : "",
            },
            line_items: products.map((p) => ({
              product_id: p.product_id,
              quantity: p.product_qty,
            })),
            shipping_lines: [
              {
                method_id: "flat_rate",
                method_title: shippingTitle,
                total: shippingCost.toString(),
              },
            ],
          };
        }

        const options = {
          method: "POST",
          url: `http://localhost:8000/orders`,
          data: JSON.stringify({ dataOrder }),
          headers: {
            "Content-Type": "application/json",
          },
        };

        axios
          .request(options)
          .then(function (response) {
            const options = {
              method: "DELETE",
              url: `http://localhost:8000/temp_cart_delete_on_order?cartId=${cartId}`,
            };

            axios
              .request(options)
              .then(function (response) {
                if (createAccount) {
                  const dataCustomer = {
                    email: formValues.email,
                    first_name: formValues.first_name,
                    last_name: formValues.surname,
                    username:
                      formValues.first_name.toLowerCase() +
                      "." +
                      formValues.surname.toLowerCase(),
                    billing: {
                      first_name: formValues.first_name,
                      last_name: formValues.surname,
                      company:
                        formValues.company !== "" ? formValues.company : "",
                      address_1: formValues.address,
                      address_2: "",
                      city: formValues.local,
                      state: formValues.district,
                      postcode: formValues.postcode,
                      country: formValues.country == 2 ? "PT" : "",
                      email: formValues.email,
                      phone: formValues.phone,
                    },
                    shipping: {
                      first_name: formValues.first_name,
                      last_name: formValues.surname,
                      company:
                        formValues.company !== "" ? formValues.company : "",
                      address_1: formValues.address,
                      address_2: "",
                      city: formValues.local,
                      state: formValues.district,
                      postcode: formValues.postcode,
                      country: formValues.country == 2 ? "PT" : "",
                    },
                  };

                  const options = {
                    method: "POST",
                    url: `http://localhost:8000/customers`,
                    data: JSON.stringify({ dataCustomer }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  };

                  axios
                    .request(options)
                    .then(function (response) {
                      setMessage(
                        "A sua conta foi criada com sucesso! Pode efectuar o login com o seu nome de utilizador gerado (" +
                          formValues.first_name.toLowerCase() +
                          "." +
                          formValues.surname.toLowerCase() +
                          ") e a password que forneceu."
                      );
                      setStatus("success");
                      setIsModalOpen(true);
                    })
                    .catch(function (error) {
                      setMessage(
                        "Houve um erro na criacao da conta. Por favor envie e-mail para geral@petplushies.pt para notificar do sucedido. (" +
                          error.response.data +
                          ".)"
                      );
                      setStatus("error");
                      setIsModalOpen(true);
                    });
                } else {
                  setMessage(
                    "Encomenda efectuada com sucesso! Vai receber um e-mail com os detalhes da encomenda e do seu pagamento."
                  );
                  setStatus("success");
                  setIsModalOpen(true);
                }
              })
              .catch(function (error) {
                setMessage(
                  "Houve um erro ao efectuar a encomenda. (" + error + ".)"
                );
                setStatus("error");
                setIsModalOpen(true);
              });
          })
          .catch(function (error) {
            setError(true);
          });
      })
      .catch((errorInfo) => {
        setMessage("Tem de preencher todos os campos obrigatorios.");
        setStatus("error");
        setIsModalOpen(true);
      });
  };

  const totalWeight = products.reduce((total, item) => {
    const productQty = parseInt(item.product_qty, 10);
    const productWeight = parseFloat(item.product.weight);
    const itemWeight = productQty * productWeight;

    return total + itemWeight;
  }, 0);

  const handleCountry = (value) => {
    fetchShippingZonesDetails(value);
    setCountry(value);

    if (value === "2") {
      setSecondSelectOptions(PortugalDistricts);
    } else {
      setSecondSelectOptions([]);
    }
  };

  const handleCountryShipping = (value) => {
    fetchShippingZonesDetails(value);
    setCountry(value);

    if (value === "2") {
      setSecondSelectOptions(PortugalDistricts);
    } else {
      setSecondSelectOptions([]);
    }
  };

  const handlePaymentMethod = (paymentMethod) => {
    const selectedValue = paymentMethod.value;
    const selectedLabel = paymentMethod.label;

    setPaymentMethod({ label: selectedLabel, value: selectedValue });
  };

  const handleOnPayPalSuccess = (details, data) => {
    console.log("details:", details);
    console.log("data:", data);
    console.log("Transaction completed by " + details.payer.name.given_name);
    handlePlaceOrder(data.orderID);
  };

  const handleOnPayPalError = (err) => {
    console.error("Transaction failed:", err);
    setMessage("Erro na transaccao. (" + err + ")");
    setStatus("error");
    setIsModalOpen(true);
  };

  const handleOnPayPalCancel = (data) => {
    console.log("Transaction canceled:", data);
    setMessage("Transaccao cancelada. (" + data + ")");
    setStatus("error");
    setIsModalOpen(true);
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
        <StyledH1>Finalizar compra</StyledH1>
        <StyledRow>
          <Col span={12}>
            <div>
              <CheckoutForm
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
              />
            </div>
          </Col>
          <Col span={11}>
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
              <div>{totalProductNetRevenue}&euro;</div>
            </Subtotal>
            <Shipping>
              <div>Estimativa de portes</div>
              <div>{shippingCost}&euro;</div>
            </Shipping>
            <Border />
            <Total>
              <div>Subtotal</div>
              <div>{totalProductNetRevenue + shippingCost}&euro;</div>
            </Total>
            {paymentMethod.label == "PayPal" ? (
              <PayPalButton
                amount={totalProductNetRevenue + shippingCost} // Set your transaction amount
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
                onClick={() => handlePlaceOrder()}
              />
            )}
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
      border-color: black;

      &:before {
        display: none;
      }
    }

    & .ant-table-row {
      height: 100px;
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
  path: "/finalizar-compra",
  exact: true,
  component: Checkout,
};
