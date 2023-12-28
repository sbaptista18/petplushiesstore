import { Col, Row, Checkbox, Form, Input, Select, Radio } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { paymentMethods } from "./data";

const { TextArea } = Input;

const CheckoutForm = ({
  disabled,
  handleCountry,
  handleCheckCreateAccount,
  handleCheckShipAddress,
  shipToAddress,
  handleCountryShipping,
  country,
  secondSelectOptions,
  handlePaymentMethod,
  form,
  data,
}) => {
  const [countries, setCountries] = useState([]);
  // const [selectedCountry, setSelectedCountry] = useState();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_selling_countries`
        );
        const data = await response.json();
        setCountries(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      form.setFieldsValue({
        first_name: data?.billing.first_name,
        surname: data?.billing.last_name,
        company: data?.billing.company,
        address: data?.billing.address_1,
        local: data?.billing.city,
        postcode: data?.billing.postcode,
        phone: data?.billing.phone,
        email: data?.billing.email,
        first_name_other: data?.shipping.first_name,
        surname_other: data?.shipping.last_name,
        company_other: data?.shipping.company,
        address_other: data?.shipping.address_1,
        local_other: data?.shipping.city,
        postcode_other: data?.shipping.postcode,
      });
    }
  }, [data, form]);

  return (
    <Form
      disabled={disabled}
      layout="vertical"
      form={form}
      name="checkout"
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
          <Form.Item wrapperCol={24} name="company" label="Empresa (opcional)">
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
                message: "Por favor seleccione o seu país.",
              },
            ]}
            label="País"
            wrapperCol={24}
            name="country"
          >
            <Select value={country} onChange={handleCountry}>
              {countries.map((c) => {
                const country = c.name;
                const code = c.code;

                return (
                  <Select.Option key={code} value={code}>
                    {country}
                  </Select.Option>
                );
              })}
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
                message: "Por favor seleccione o distrito/região.",
              },
            ]}
            label="Distrito/Região"
            wrapperCol={24}
            name="district"
          >
            <Select>
              {countries.map((c) => {
                if (c.code === secondSelectOptions) {
                  const states = c.states;
                  const statesArray = Object.entries(states);
                  return statesArray.map((s) => (
                    <Select.Option key={s[0]} value={s[1]}>
                      {s[1]}
                    </Select.Option>
                  ));
                }
                return null; // Add this to handle the case where the condition is not met
              })}
            </Select>
          </Form.Item>
        </Col>
      </FormRow>
      <FormRow>
        <Col span={24}>
          <Form.Item
            wrapperCol={24}
            name="postcode"
            label="Código-postal"
            rules={[
              {
                required: true,
                message: "Por favor insira o seu código-postal.",
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
                message: "O e-mail inserido nao é válido.",
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
                    message: "Por favor seleccione o seu país.",
                  },
                ]}
                label="País"
                wrapperCol={24}
                name="country_other"
              >
                <Select value={country} onChange={handleCountryShipping}>
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
                    message: "Por favor seleccione o distrito/região.",
                  },
                ]}
                label="Distrito/Região"
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
                    message: "Por favor insira o seu código-postal.",
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
                placeholder="Aqui pode deixar instruções especiais como, por exemplo, 'A campaínha não toca.'"
              />
            </>
          </Form.Item>
        </Col>
      </FormRow>

      <FormRow>
        <Form.Item
          wrapperCol={24}
          name="payment_method"
          label="Método de pagamento"
          rules={[
            {
              required: true,
              message: "Tem de seleccionar um método de pagamento.",
            },
          ]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            {paymentMethods.map((p) => {
              return (
                <Radio.Button
                  onClick={() => handlePaymentMethod(p)}
                  key={p.value}
                  value={p.value}
                >
                  {p.name}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </FormRow>

      <Form.Item
        name="accept_terms"
        valuePropName="checked"
        wrapperCol={24}
        rules={[
          {
            required: true,
            message: "Tem de confirmar a leitura dos Termos & Condições.",
          },
        ]}
      >
        <Checkbox>
          Declaro que li e aceito os{" "}
          <Link to="/termos-e-condicoes" target="_blank">
            Termos & Condições
          </Link>
        </Checkbox>
      </Form.Item>
    </Form>
  );
};

const FormRow = styled(Row)`
  justify-content: space-between;
`;

export default CheckoutForm;
