import { Row, Col, Form, Checkbox, Input, Select } from "antd";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "components";

const PersonalDataForm = ({
  data,
  form,
  setDisabled,
  handleCountry,
  handleCountryShipping,
  country,
  secondSelectOptions,
  handleSubmitPersonalData,
  disabled,
  loadingButton,
}) => {
  const { t } = useTranslation();

  const initialValues = {
    first_name: data?.billing.first_name,
    surname: data?.billing.last_name,
    company: data?.billing.company,
    country: data?.billing.country,
    country_code: data?.billing.country_code,
    address: data?.billing.address_1,
    local: data?.billing.city,
    district: data?.billing.state,
    postcode: data?.billing.postcode,
    phone: data?.billing.phone,
    email: data?.billing.email,
    first_name_other: data?.shipping.first_name,
    surname_other: data?.shipping.last_name,
    company_other: data?.shipping.company,
    country_other: data?.shipping.country,
    country_code_other: data?.shipping.country_code,
    address_other: data?.shipping.address_1,
    local_other: data?.shipping.city,
    district_other: data?.shipping.state,
    postcode_other: data?.shipping.postcode,
  };

  const [countries, setCountries] = useState([]);
  const [selectedBillingCountry, setSelectedBillingCountry] = useState("");
  const [selectedShippingCountry, setSelectedShippingCountry] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_selling_countries`
        );
        const data = await response.json();
        setCountries(data.data);

        setSelectedBillingCountry(initialValues.country_code);
        setSelectedShippingCountry(initialValues.country_code_other);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (secondSelectOptions != "") {
      setSelectedBillingCountry(secondSelectOptions);
      setSelectedShippingCountry(secondSelectOptions);
    }
  }, [secondSelectOptions]);

  return (
    <div>
      <Checkbox
        checked={disabled}
        onChange={(e) => setDisabled(e.target.checked)}
      >
        {t("modoEdicao")}
      </Checkbox>

      <Form
        layout="vertical"
        form={form}
        name="personal_data"
        disabled={!disabled}
        initialValues={initialValues}
      >
        <FormRow>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="first_name" label={t("nome")}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="surname" label={t("apelido")}>
              <Input />
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>{t("moradaFaturacao")}</FormRow>
        <FormRow>
          <Col span={24}>
            <Form.Item wrapperCol={24} name="company" label={t("empresa")}>
              <Input />
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={24}>
            <Form.Item label={t("pais")} wrapperCol={24} name="country">
              <Select
                value={country}
                onChange={handleCountry}
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
            <Form.Item name="address" label={t("morada")} wrapperCol={24}>
              <Input />
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="local" label={t("localidade")}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label={t("distrito")} wrapperCol={24} name="district">
              <Select showSearch optionFilterProp="children">
                {countries.map((c) => {
                  if (c.code === selectedBillingCountry) {
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
              ]}
              wrapperCol={24}
            >
              <Input />
            </Form.Item>
          </Col>
        </FormRow>

        <FormRow>{t("moradaEntrega")}</FormRow>

        <FormRow>
          <Col span={11}>
            <Form.Item
              wrapperCol={24}
              name="first_name_other"
              label={t("nome")}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              wrapperCol={24}
              name="surname_other"
              label={t("apelido")}
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
            <Form.Item label={t("pais")} wrapperCol={24} name="country_other">
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
            <Form.Item name="address_other" label={t("morada")} wrapperCol={24}>
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
                  if (c.code === selectedShippingCountry) {
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
            >
              <Input />
            </Form.Item>
          </Col>
        </FormRow>

        <FormRow>
          <Col span={24}>
            <Form.Item wrapperCol={24}>
              <StyledButton
                size="large"
                text={t("actualizarDadosPessoais")}
                type="primary"
                htmlType="submit"
                onClick={handleSubmitPersonalData}
                loading={loadingButton}
                disabled={loadingButton}
              />
            </Form.Item>
          </Col>
        </FormRow>
      </Form>
    </div>
  );
};

const FormRow = styled(Row)`
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default PersonalDataForm;
