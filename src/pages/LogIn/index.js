import styled from "styled-components";
import { Row, Checkbox, Form, Input } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { SimpleJwtLogin } from "simple-jwt-login";

import { Button } from "components";

const LogIn = () => {
  const [error, setError] = useState("");
  const history = useHistory();

  const [form] = Form.useForm();

  const handleAuth = async () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();

      try {
        const responseAuth = await axios.post(
          `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/auth&email=${encodeURIComponent(
            formValues.email
          )}&password=${btoa(formValues.password)}`
        );

        if (responseAuth.data.success == true) {
          localStorage.setItem("token", responseAuth.data.data.jwt);
          handleValidation(responseAuth.data.data.jwt);
        }
      } catch (error) {
        setError(
          error.response.data.data.errorCode == 48
            ? "Os dados de login estao incorrectos."
            : "Erro no login. Por favor contactar geral@petplushies.pt para resolver o problema."
        );
      }
    });
  };

  const handleValidation = async (jwtToken) => {
    try {
      const response = await axios.get(
        `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/auth/validate&JWT=${jwtToken}`
      );

      if (response.data.success == true) handleLogin(response.data.data);
    } catch (error) {
      setError(error.response.data.data.message);
    }
  };

  const handleLogin = async (data) => {
    const jwtToken = data.jwt[0].token;
    const user = data.user;
    try {
      const response = await axios.get(
        `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/autologin&JWT=${jwtToken}`
      );

      if (response.data.success == true) {
        localStorage.setItem("user", JSON.stringify(user));
        history.replace("/minha-conta", { data: jwtToken });
      }
    } catch (error) {
      setError(error.response.data.data.message);
    }
  };

  return (
    <Container>
      <ContentLocked>
        <StyledH1>Entrar na conta</StyledH1>
        <div>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={handleAuth}
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
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Por favor insira a password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Checkbox>Lembrar-me</Checkbox>
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
                text="Entrar"
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
  path: "/login",
  exact: true,
  component: LogIn,
};
