import styled from "styled-components";
import { useState } from "react";
import { Row, Col, Table, Checkbox, Form, Input, Select } from "antd";

import { Button } from "components";

import products from "../../data/mock_products";
import table_render from "./table_render";

const { TextArea } = Input;

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

  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const handleCheckCreateAccount = () => {
    setCreateAccount((prevState) => !prevState);
  };

  const handleCheckShipAddress = () => {
    setShipToAddress((prevState) => !prevState);
  };

  return (
    <Container>
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
                      <Select>
                        <Select.Option value="demo">Demo</Select.Option>
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
                  <Col span={24}>
                    <Form.Item
                      rules={[
                        {
                          required: true,
                          message: "Por favor seleccione a cidade.",
                        },
                      ]}
                      label="Cidade"
                      wrapperCol={24}
                      name="city"
                    >
                      <Select>
                        <Select.Option value="demo">Demo</Select.Option>
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
                      name="shoip_to_address"
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
                          <Select>
                            <Select.Option value="demo">Demo</Select.Option>
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
                      <Col span={24}>
                        <Form.Item
                          rules={[
                            {
                              required: true,
                              message: "Por favor seleccione a cidade.",
                            },
                          ]}
                          label="Cidade"
                          wrapperCol={24}
                          name="city_other"
                        >
                          <Select>
                            <Select.Option value="demo">Demo</Select.Option>
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
              </Form>
            </div>
          </Col>
          <Col span={11}>
            <Title>O meu carrinho</Title>
            <Border />
            <StyledTable
              columns={table_render}
              dataSource={products}
              pagination={false}
            />
            <Title>Resumo da compra</Title>
            <Border />
            <Subtotal>
              <div>Subtotal</div>
              <div>100&euro;</div>
            </Subtotal>
            <Shipping>
              <div>Estimativa de portes</div>
              <div>20&euro;</div>
            </Shipping>
            <Border />
            <Total>
              <div>Subtotal</div>
              <div>120&euro;</div>
            </Total>
            <StyledButton
              size="large"
              type="primary"
              text="Efectuar pagamento"
            />
          </Col>
        </StyledRow>
      </ContentLocked>
    </Container>
  );
};

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
