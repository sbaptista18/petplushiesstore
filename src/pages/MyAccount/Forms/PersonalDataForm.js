import { Row, Col, Form, Checkbox, Input, Select } from "antd";
import styled from "styled-components";

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
}) => {
  const initialValues = {
    first_name: data?.billing.first_name,
    surname: data?.billing.last_name,
    company: data?.billing.company,
    country: data?.billing.country,
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
    address_other: data?.shipping.address_1,
    local_other: data?.shipping.city,
    district_other: data?.shipping.state,
    postcode_other: data?.shipping.postcode,
  };

  return (
    <div>
      <Checkbox
        checked={disabled}
        onChange={(e) => setDisabled(e.target.checked)}
      >
        Modo de edicao
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
            <Form.Item wrapperCol={24} name="first_name" label="Nome">
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="surname" label="Apelido">
              <Input />
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>Morada de Facturacao</FormRow>
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
            <Form.Item label="Pais/Regiao" wrapperCol={24} name="country">
              <Select value={country} onChange={handleCountry}>
                <Select.Option value="PT">Portugal</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={24}>
            <Form.Item name="address" label="Morada" wrapperCol={24}>
              <Input />
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="local" label="Localidade">
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label="Distrito" wrapperCol={24} name="district">
              <Select>
                {secondSelectOptions?.map((option) => (
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
            <Form.Item wrapperCol={24} name="postcode" label="Codigo-postal">
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
              ]}
              wrapperCol={24}
            >
              <Input />
            </Form.Item>
          </Col>
        </FormRow>

        <FormRow>Morada de Entrega</FormRow>

        <FormRow>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="first_name_other" label="Nome">
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="surname_other" label="Apelido">
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
            <Form.Item label="Pais/Regiao" wrapperCol={24} name="country_other">
              <Select value={country} onChange={handleCountryShipping}>
                <Select.Option value="PT">Portugal</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={24}>
            <Form.Item name="address_other" label="Morada" wrapperCol={24}>
              <Input />
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={11}>
            <Form.Item wrapperCol={24} name="local_other" label="Localidade">
              <Input />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item label="Distrito" wrapperCol={24} name="district_other">
              <Select>
                {secondSelectOptions?.map((option) => (
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
                text="Actualizar dados pessoais"
                type="primary"
                htmlType="submit"
                onClick={handleSubmitPersonalData}
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
