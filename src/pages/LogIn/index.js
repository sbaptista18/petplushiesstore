import styled from "styled-components";
import { Row, Form, Input } from "antd";
import { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";

import { Button, PageHeader, ModalMessage } from "components";
import { useCart } from "reducers";
import { SEOTags } from "fragments";
import { useTranslation } from "react-i18next";

import DummyImg from "assets/images/batcat-1.jpg";

const LogIn = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const [form] = Form.useForm();
  const { setLoggedIn } = useCart();

  const [loadingLogin, setLoadingLogin] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  if (localStorage.getItem("isLoggedIn") === "false") {
    localStorage.removeItem("user");
    localStorage.removeItem("userCart");
  }

  const handleAuth = async () => {
    setLoadingLogin(true);
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
        const errorMessage =
          error.response.data.data.errorCode == 48
            ? t("dadosLoginIncorrectos")
            : t("erroLogin");
        setMessage(errorMessage);
        setStatus("error");
        setIsModalOpen(true);
        setLoadingLogin(false);
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
      setMessage(error.response.data.data.message);
      setStatus("error");
      setIsModalOpen(true);
    }
  };

  const handleLogin = async (data) => {
    const jwtToken = data.jwt[0].token;
    const user = data.user;
    setLoggedIn(true);
    try {
      const response = await axios.get(
        `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/autologin&JWT=${jwtToken}`
      );
      localStorage.removeItem("tempCart");

      if (response.data.success) {
        setLoadingLogin(false);
        localStorage.setItem("user", JSON.stringify(user));

        const cartData = {
          key: user.user_login,
        };

        localStorage.setItem("userCart", JSON.stringify(cartData));
        setTimeout(() => {
          history.replace("/minha-conta", { data: jwtToken });
        }, 1000);
      }
    } catch (error) {
      setMessage(error.response.data.data.message);
      setStatus("error");
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <ModalMessage
        status={status}
        message={message}
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <SEOTags
        title={`Login - Pet Plushies`}
        description=""
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader title="Login" img={DummyImg} alt="Login - Pet Plushies" />
      <Container>
        <ContentLocked>
          <FormContainer>
            <Form
              form={form}
              name="basic"
              labelCol={{
                span: 5,
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
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("inserirPassword"),
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <StyledButton
                  size="large"
                  text={t("entrar")}
                  type="primary"
                  htmlType="submit"
                  loading={loadingLogin}
                  disabled={loadingLogin}
                />
              </Form.Item>

              <Form.Item>
                <Link to="/recuperar-password">{t("recuperarPassword")}</Link>
              </Form.Item>

              <Form.Item>
                <Link to="/registar">{t("naoTemConta")}</Link>
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
  background-color: var(--white);
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
