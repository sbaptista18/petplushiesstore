import { Col, Row, Checkbox, Form, Input, Select, Radio } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
  accountError,
  handleOrderNote,
  orderNote,
  isLoggedIn,
}) => {
  const [countries, setCountries] = useState([]);
  const { t } = useTranslation();

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

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function toCamelCase(inputString) {
    const withoutDiacritics = removeDiacritics(inputString);

    return withoutDiacritics
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  }

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
            label={t("nome")}
            rules={[
              {
                required: true,
                message: t("inserirNome"),
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
            label={t("apelido")}
            rules={[
              {
                required: true,
                message: t("inserirApelido"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </FormRow>
      <FormRow>
        <Col span={24}>
          <Form.Item wrapperCol={24} name="company" label={t("empresa")}>
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
                message: t("seleccionarPais"),
              },
            ]}
            label={t("pais")}
            wrapperCol={24}
            name="country"
          >
            <Select
              showSearch
              value={country}
              onChange={handleCountry}
              optionFilterProp="children"
            >
              {countries.map((c) => {
                const country = c.name;
                const code = c.code;

                return (
                  <Select.Option key={code} value={code} label={country}>
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
            label={t("morada")}
            rules={[
              {
                required: true,
                message: t("inserirMorada"),
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
            label={t("localidade")}
            rules={[
              {
                required: true,
                message: t("inserirLocalidade"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item label={t("distrito")} wrapperCol={24} name="district">
            <Select showSearch optionFilterProp="children">
              {countries.map((c) => {
                if (c.code === secondSelectOptions) {
                  const states = c.states;
                  const statesArray = Object.entries(states);
                  return statesArray.map((s) => (
                    <Select.Option key={s[0]} value={s[1]} label={s[1]}>
                      {s[1]}
                    </Select.Option>
                  ));
                }
                return null;
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
            label={t("codigoPostal")}
            rules={[
              {
                required: true,
                message: t("inserirCodigoPostal"),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
      </FormRow>
      <FormRow>
        <Col span={11}>
          <Form.Item wrapperCol={24} name="phone" label={t("telefone")}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={11}>
          <Form.Item
            name="email"
            label={t("email")}
            rules={[
              {
                type: "email",
                message: t("emailInvalido"),
              },
              {
                required: true,
                message: t("inserirEmail"),
              },
            ]}
            wrapperCol={24}
          >
            <Input />
          </Form.Item>
        </Col>
      </FormRow>
      {!isLoggedIn && (
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
              <Checkbox>{t("criarConta")}</Checkbox>
            </Form.Item>
            <>{accountError != "" && accountError}</>
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
            <Checkbox>{t("moradaDiferente")}</Checkbox>
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
                label={t("nome")}
                rules={[
                  {
                    required: true,
                    message: t("inserirNome"),
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
                label={t("apelido")}
                rules={[
                  {
                    required: true,
                    message: t("apelido"),
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
                label={t("empresa")}
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
                    message: t("seleccionarPais"),
                  },
                ]}
                label={t("pais")}
                wrapperCol={24}
                name="country_other"
              >
                <Select
                  value={country}
                  onChange={handleCountryShipping}
                  showSearch
                  optionFilterProp="children"
                >
                  {countries.map((c) => {
                    const country = c.name;
                    const code = c.code;

                    return (
                      <Select.Option key={code} value={code} label={country}>
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
                name="address_other"
                label={t("morada")}
                rules={[
                  {
                    required: true,
                    message: t("inserirMorada"),
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
                label={t("localidade")}
                rules={[
                  {
                    required: true,
                    message: t("inserirLocalidade"),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                label={t("distrito")}
                wrapperCol={24}
                name="district_other"
              >
                <Select showSearch optionFilterProp="children">
                  {countries.map((c) => {
                    if (c.code === secondSelectOptions) {
                      const states = c.states;
                      const statesArray = Object.entries(states);
                      return statesArray.map((s) => (
                        <Select.Option key={s[0]} value={s[1]} label={s[1]}>
                          {s[1]}
                        </Select.Option>
                      ));
                    }
                    return null;
                  })}
                </Select>
              </Form.Item>
            </Col>
          </FormRow>
          <FormRow>
            <Col span={24}>
              <Form.Item
                wrapperCol={24}
                name="postcode_other"
                label={t("codigoPostal")}
                rules={[
                  {
                    required: true,
                    message: t("inserirCodigoPostal"),
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
          <Form.Item
            name="order_notes"
            wrapperCol={24}
            onChange={handleOrderNote}
          >
            <>
              <span>{t("notasEncomenda")}</span>
              <TextArea
                value={orderNote}
                rows={4}
                placeholder={t("notasEncomendaPlaceholder")}
              />
            </>
          </Form.Item>
        </Col>
      </FormRow>

      <FormRow>
        <Form.Item
          wrapperCol={24}
          name="payment_method"
          label={t("metodoPagamento")}
          rules={[
            {
              required: true,
              message: t("seleccionarMetodoPagamento"),
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
                  {t(toCamelCase(p.name))}
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
            message: t("confirmarTermos"),
          },
        ]}
      >
        <Checkbox>
          {t("declararTC")}{" "}
          <Link to="/termos-e-condicoes" target="_blank">
            {t("termosCondicoes")}
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
