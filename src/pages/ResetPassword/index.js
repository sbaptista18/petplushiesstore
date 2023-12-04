import styled from "styled-components";
import { Row, Form, Input } from "antd";
import { useState } from "react";
import axios from "axios";

import { Button } from "components";

const ResetPassword = () => {
  const [error, setError] = useState("");

  const [form] = Form.useForm();

  // Function to initiate password reset
  const initiatePasswordReset = async () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();

      try {
        const response = await axios.post(
          `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${formValues.email}`
        );
        console.log(response.data);
        setError(response.data.message);
      } catch (error) {
        setError(error.response.data);
      }
    });
  };

  return (
    <Container>
      <ContentLocked>
        <StyledH1>Recuperar password</StyledH1>
        <div>
          <Form
            form={form}
            name="initiate-reset-password"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={initiatePasswordReset}
            autoComplete="off"
          >
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
            >
              <Input />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <StyledButton
                size="large"
                color="green"
                text="Enviar e-mail de recuperacao"
                type="primary"
                htmlType="submit"
              />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              {error && (
                <div
                  style={{ color: "red" }}
                  dangerouslySetInnerHTML={{ __html: error }}
                ></div>
              )}
            </Form.Item>
          </Form>
        </div>
      </ContentLocked>
    </Container>
  );
};

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
`;

const StyledH1 = styled.h1`
  margin-top: 30px;
  font-size: 52px;
`;

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default {
  path: "/recuperar-password",
  exact: true,
  component: ResetPassword,
};