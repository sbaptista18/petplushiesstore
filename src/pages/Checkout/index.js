import styled from "styled-components";
import { useState, useEffect } from "react";
import { Row, Col, Table, Checkbox, Form, Input, Select, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";

import { Button, ModalMessage } from "components";
import { ConnectWC, tableColumnsCheckout } from "fragments";
import { useCart } from "reducers";

const { TextArea } = Input;

const CustomNoData = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    O carrinho esta vazio.
  </div>
);

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

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
  const [country, setCountry] = useState(""); // Initial value for the country select
  const [secondSelectOptions, setSecondSelectOptions] = useState([""]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  const [form] = Form.useForm();

  const history = useHistory();

  useEffect(() => {
    if (cartId == null) history.replace("/carrinho");
    else fetchCartId(cartId);
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

  const calculateShippingCost = (data, weight, subtotal) => {
    // Check if subtotal is more than 50 and set shipping cost to 0
    if (subtotal > 50) {
      return 0;
    }

    // Find the appropriate shipping method based on weight
    const method = data.find((shippingMethod) => {
      // Extract weight range from the title
      const title = shippingMethod.title.toLowerCase();
      const match = title.match(/(\d+)\s*g\s*a\s*(\d+)?/);

      setShippingTitle(shippingMethod.title);

      if (match) {
        const minWeight = parseInt(match[1]);
        const maxWeight = match[2] ? parseInt(match[2]) : undefined;

        // Check if the weight falls within the range
        return (
          weight >= minWeight &&
          (maxWeight === undefined || weight <= maxWeight)
        );
      }

      return false;
    });

    if (method) {
      // Extract cost value from settings
      const cost = parseFloat(method.settings.cost.value);

      // Calculate the cost based on your formula (if needed)
      // For now, just returning the cost directly
      return cost;
    } else {
      // No matching method found
      return null;
    }
  };

  const fetchShippingZonesDetails = async (area) => {
    ConnectWC.get("shipping/zones/" + area + "/methods")
      .then((data) => {
        const weightGrs = totalWeight * 1000;
        const shippingCost = calculateShippingCost(
          data,
          weightGrs,
          totalProductNetRevenue
        );

        setShippingCost(shippingCost);
      })
      .catch((error) => {
        setError(true);
      });
  };

  const totalProductNetRevenue = productsCart.reduce((sum, item) => {
    return sum + parseInt(item.product_net_revenue, 10);
  }, 0);

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleCheckCreateAccount = () => {
    setCreateAccount((prevState) => !prevState);
  };

  const handleCheckShipAddress = () => {
    setShipToAddress((prevState) => !prevState);
  };

  const handlePlaceOrder = () => {
    form
      .validateFields()
      .then(() => {
        const formValues = form.getFieldsValue();

        let data;

        if (formValues.first_name_other) {
          data = {
            payment_method: "bacs",
            payment_method_title: "Direct Bank Transfer",
            set_paid: false,
            status: "on-hold",
            billing: {
              first_name: formValues.first_name,
              last_name: formValues.surname,
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
          data = {
            payment_method: "bacs",
            payment_method_title: "Direct Bank Transfer",
            set_paid: false,
            status: "on-hold",
            billing: {
              first_name: formValues.first_name,
              last_name: formValues.surname,
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

        ConnectWC.post("orders", data)
          .then((response) => {
            // console.log(response.data);
            ConnectWC.delete("temp_cart_delete_on_order/" + cartId)
              .then((response) => {
                setMessage(
                  "Order placed! You should receive details on your email in order to proceed to the payment."
                );
                setStatus("success");
                setIsModalOpen(true);
              })
              .catch((error) => {
                setMessage(
                  "There was an error placing the order. (" + error + ".)"
                );
                setStatus("error");
                setIsModalOpen(true);
              });
          })
          .catch((error) => {
            setError(true);
          });
      })
      .catch((errorInfo) => {
        // Display error messages for validation failures
        setMessage(
          "Tem de preencher todos os campos obrigatorios. (" + errorInfo + ".)"
        );
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

    // Set options for the second Select based on the selected country
    if (value === "2") {
      // If Portugal is selected, set specific options
      setSecondSelectOptions([
        "Aveiro",
        "Beja",
        "Braga",
        "Bragança",
        "Castelo Branco",
        "Coimbra",
        "Évora",
        "Faro",
        "Guarda",
        "Leiria",
        "Lisboa",
        "Portalegre",
        "Porto",
        "Santarém",
        "Setúbal",
        "Viana do Castelo",
        "Vila Real",
        "Viseu",
      ]);
    } else {
      // Handle other countries or set a default set of options
      setSecondSelectOptions(["demo"]);
    }
  };

  const handleCountryShipping = (value) => {
    fetchShippingZonesDetails(value);
    setCountry(value);

    // Set options for the second Select based on the selected country
    if (value === "2") {
      // If Portugal is selected, set specific options
      setSecondSelectOptions([
        "Aveiro",
        "Beja",
        "Braga",
        "Bragança",
        "Castelo Branco",
        "Coimbra",
        "Évora",
        "Faro",
        "Guarda",
        "Leiria",
        "Lisboa",
        "Portalegre",
        "Porto",
        "Santarém",
        "Setúbal",
        "Viana do Castelo",
        "Vila Real",
        "Viseu",
      ]);
    } else {
      // Handle other countries or set a default set of options
      setSecondSelectOptions(["demo"]);
    }
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
              <Form
                layout="vertical"
                {...formItemLayout}
                form={form}
                name="register"
                onFinish={onFinish}
                style={{
                  maxWidth: 600,
                }}
                scrollToFirstError
              >
                <FormRow>
                  <Col span={11}>
                    <Form.Item
                      wrapperCol={24}
                      name="first_name"
                      label="Nome"
                      rules={[
                        {
                          required: true,
                          message: "Por favor insira o seu nome.",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      wrapperCol={24}
                      name="surname"
                      label="Apelido"
                      rules={[
                        {
                          required: true,
                          message: "Por favor insira o seu apelido.",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </FormRow>
                <FormRow>
                  <Col span={24}>
                    <Form.Item
                      wrapperCol={24}
                      name="company"
                      label="Empresa (opcional)"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </FormRow>
                <FormRow>
                  <Col span={24}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Por favor seleccione o seu pais/regiao.",
                        },
                      ]}
                      label="Pais/Regiao"
                      wrapperCol={24}
                      name="country"
                    >
                      <Select value={country} onChange={handleCountry}>
                        <Select.Option value="2">Portugal</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </FormRow>
                <FormRow>
                  <Col span={24}>
                    <Form.Item
                      name="address"
                      label="Morada"
                      rules={[
                        {
                          required: true,
                          message: "Por favor insira a sua morada.",
                        },
                      ]}
                      wrapperCol={24}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </FormRow>
                <FormRow>
                  <Col span={11}>
                    <Form.Item
                      wrapperCol={24}
                      name="local"
                      label="Localidade"
                      rules={[
                        {
                          required: true,
                          message: "Por favor insira a localidade.",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Por favor seleccione o distrito.",
                        },
                      ]}
                      label="Distrito"
                      wrapperCol={24}
                      name="district"
                    >
                      <Select>
                        {secondSelectOptions.map((option) => (
                          <Select.Option key={option} value={option}>
                            {option}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </FormRow>
                <FormRow>
                  <Col span={24}>
                    <Form.Item
                      wrapperCol={24}
                      name="postcode"
                      label="Codigo-postal"
                      rules={[
                        {
                          required: true,
                          message: "Por favor insira o seu codigo-postal.",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </FormRow>
                <FormRow>
                  <Col span={11}>
                    <Form.Item wrapperCol={24} name="phone" label="Telefone">
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      name="email"
                      label="E-mail"
                      rules={[
                        {
                          type: "email",
                          message: "O e-mail inserido nao e valido.",
                        },
                        {
                          required: true,
                          message: "Por favor insira o seu e-mail.",
                        },
                      ]}
                      wrapperCol={24}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </FormRow>
                <FormRow>
                  <Col span={24}>
                    <Form.Item
                      name="create_account"
                      valuePropName="checked"
                      onChange={() => {
                        handleCheckCreateAccount();
                      }}
                      wrapperCol={24}
                    >
                      <Checkbox>Criar conta?</Checkbox>
                    </Form.Item>
                  </Col>
                </FormRow>

                {createAccount && (
                  <FormRow>
                    <Col span={24}>
                      <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                          {
                            required: true,
                            message: "Por favor escolha a sua password.",
                          },
                        ]}
                        hasFeedback
                        wrapperCol={24}
                      >
                        <Input.Password />
                      </Form.Item>
                    </Col>
                  </FormRow>
                )}

                <FormRow>
                  <Col span={24}>
                    <Form.Item
                      name="ship_to_address"
                      valuePropName="checked"
                      onChange={() => {
                        handleCheckShipAddress();
                      }}
                      wrapperCol={24}
                    >
                      <Checkbox>Enviar para uma morada diferente?</Checkbox>
                    </Form.Item>
                  </Col>
                </FormRow>

                {shipToAddress && (
                  <>
                    <FormRow>
                      <Col span={11}>
                        <Form.Item
                          wrapperCol={24}
                          name="first_name_other"
                          label="Nome"
                          rules={[
                            {
                              required: true,
                              message: "Por favor insira o seu nome.",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={11}>
                        <Form.Item
                          wrapperCol={24}
                          name="surname_other"
                          label="Apelido"
                          rules={[
                            {
                              required: true,
                              message: "Por favor insira o seu apelido.",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </FormRow>
                    <FormRow>
                      <Col span={24}>
                        <Form.Item
                          wrapperCol={24}
                          name="company_other"
                          label="Empresa (opcional)"
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </FormRow>
                    <FormRow>
                      <Col span={24}>
                        <Form.Item
                          rules={[
                            {
                              required: true,
                              message:
                                "Por favor seleccione o seu pais/regiao.",
                            },
                          ]}
                          label="Pais/Regiao"
                          wrapperCol={24}
                          name="country_other"
                        >
                          <Select
                            value={country}
                            onChange={handleCountryShipping}
                          >
                            <Select.Option value="2">Portugal</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </FormRow>
                    <FormRow>
                      <Col span={24}>
                        <Form.Item
                          name="address_other"
                          label="Morada"
                          rules={[
                            {
                              required: true,
                              message: "Por favor insira a sua morada.",
                            },
                          ]}
                          wrapperCol={24}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </FormRow>
                    <FormRow>
                      <Col span={11}>
                        <Form.Item
                          wrapperCol={24}
                          name="local_other"
                          label="Localidade"
                          rules={[
                            {
                              required: true,
                              message: "Por favor insira a localidade.",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={11}>
                        <Form.Item
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione o distrito.",
                            },
                          ]}
                          label="Distrito"
                          wrapperCol={24}
                          name="district_other"
                        >
                          <Select>
                            {secondSelectOptions.map((option) => (
                              <Select.Option key={option} value={option}>
                                {option}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </FormRow>
                    <FormRow>
                      <Col span={24}>
                        <Form.Item
                          wrapperCol={24}
                          name="postcode_other"
                          label="Codigo-postal"
                          rules={[
                            {
                              required: true,
                              message: "Por favor insira o seu codigo-postal.",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </FormRow>
                  </>
                )}
                <FormRow>
                  <Col span={24}>
                    <Form.Item name="order_notes" wrapperCol={24}>
                      <>
                        <span>Notas para a encomenda</span>
                        <TextArea
                          rows={4}
                          placeholder="Aqui pode deixar instrucoes especiais como, por exemplo, 'A campainha nao toca.'"
                        />
                      </>
                    </Form.Item>
                  </Col>
                </FormRow>

                <Form.Item
                  name="accept_terms"
                  valuePropName="checked"
                  wrapperCol={24}
                  rules={[
                    {
                      required: true,
                      message:
                        "Tem de confirmar a leitura dos Termos & Condicoes.",
                    },
                  ]}
                >
                  <Checkbox>
                    Declaro que li e aceito os{" "}
                    <Link to="/termos-e-condicoes" target="_blank">
                      Termos & Condicoes
                    </Link>
                  </Checkbox>
                </Form.Item>
              </Form>
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
            <StyledButton
              size="large"
              type="primary"
              text="Finalizar encomenda"
              onClick={() => handlePlaceOrder()}
            />
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

const FormRow = styled(Row)`
  justify-content: space-between;
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
