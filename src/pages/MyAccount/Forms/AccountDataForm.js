import { Row, Col, Form, Checkbox, Input } from "antd";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { Button } from "components";

const AccountDataForm = ({
  form,
  data,
  disabled,
  setDisabled,
  handleSubmitAccountData,
}) => {
  const initialValues = {
    email: data,
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
        name="register"
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
        disabled={!disabled}
        initialValues={initialValues}
      >
        <FormRow>
          <Col span={24}>
            <Form.Item
              wrapperCol={24}
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
                text="Actualizar e-mail"
                type="primary"
                htmlType="submit"
                onClick={handleSubmitAccountData}
              />
            </Form.Item>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={24}>
            <Form.Item wrapperCol={24}>
              <Link to="/recuperar-password">
                <StyledButton
                  size="large"
                  text="Actualizar password"
                  type="primary"
                />
              </Link>
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

export default AccountDataForm;
