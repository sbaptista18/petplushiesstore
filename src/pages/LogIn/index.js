import styled from "styled-components";
import { Row, Form, Input } from "antd";
import { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";

import { Button, PageHeader } from "components";

import { useCart } from "reducers";

import DummyImg from "assets/images/batcat-1.jpg";

const LogIn = () => {
  const [error, setError] = useState("");
  const history = useHistory();

  const [form] = Form.useForm();
  const { setLoggedIn } = useCart();

  const handleAuth = async () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();

      try {
        const responseAuth = await axios.post(
          `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/auth&email=${encodeURIComponent(
            formValues.email
          )}&password=${btoa(formValues.password)}`
        );

        if (responseAuth.data.success) {
          localStorage.setItem("token", responseAuth.data.data.jwt);
          handleValidation(responseAuth.data.data.jwt);
        }
      } catch (error) {
        setError(
          error.response.data.data.errorCode == 48
            ? "Os dados de login estão incorrectos."
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

      if (response.data.success) handleLogin(response.data.data);
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

      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(user));

        const cartData = {
          key: user.user_login,
        };

        localStorage.setItem("userCart", JSON.stringify(cartData));
        localStorage.removeItem("tempCart");
        setLoggedIn(true);
        history.replace("/minha-conta", { data: jwtToken });
      }
    } catch (error) {
      setError(error.response.data.data.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Entrar na conta"
        img={DummyImg}
        alt="Entrar na conta - Pet Plusies"
      />
      <Container>
        <ContentLocked>
          <FormContainer>
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
                width: "100%",
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
                    message: "O e-mail inserido não é válido.",
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
                wrapperCol={{
                  offset: 4,
                  span: 16,
                }}
              >
                <StyledButton
                  size="large"
                  text="Entrar"
                  type="primary"
                  htmlType="submit"
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 4,
                  span: 16,
                }}
              >
                <Link to="/recuperar-password">Recuperar password</Link>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 4,
                  span: 16,
                }}
              >
                <Link to="/registar">Não possui conta? Registe-se aqui!</Link>
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 4,
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
          </FormContainer>
        </ContentLocked>
      </Container>
    </>
  );
};

const FormContainer = styled.div`
  padding: 65px 0;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  background-color: white;
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

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default {
  path: "/login",
  exact: true,
  component: LogIn,
};
