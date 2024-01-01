import styled from "styled-components";
import { Checkbox, Col, Form, Input, Row } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button, ModalMessage, PageHeader } from "components";
import { useTranslation } from "react-i18next";

import DummyImg from "assets/images/batcat-1.jpg";

const SignIn = () => {
  const { t } = useTranslation();
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  const [loadingButton, setLoadingButton] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = () => {
    setLoadingButton(true);
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();
      const dataCustomer = {
        email: formValues.email,
        first_name: formValues.first_name,
        last_name: formValues.surname,
        username:
          formValues.first_name.toLowerCase() +
          "." +
          formValues.surname.toLowerCase(),
        password: formValues.password,
      };

      try {
        const response = await fetch(
          "https://backoffice.petplushies.pt/wp-json/wc/v3/create_customer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataCustomer }),
          }
        );
        const data = await response.json();

        if (data.success) {
          setMessage(
            `${t("contaCriadaSucesso_1")} ` +
              formValues.first_name.toLowerCase() +
              "." +
              formValues.surname.toLowerCase() +
              `). ${t("contaCriadaSucesso_2")}`
          );
          setStatus("success");
          setIsModalOpen(true);
          setLoadingButton(false);
        } else {
          setMessage(
            `${t("erroCriacaoConta_1")} (` + error.response.data + ".)"
          );
          setStatus("error");
          setIsModalOpen(true);
          setLoadingButton(false);
        }
      } catch (error) {
        setMessage(t("erroCriacaoConta_2"));
        setStatus("error");
        setIsModalOpen(true);
        setLoadingButton(false);
      }
    });
  };

  const handleVerification = (value) => {
    setIsVerified(value);
  };

  return (
    <>
      <PageHeader
        title={t("registarConta")}
        img={DummyImg}
        alt={`${t("registarConta")} - Pet Plushies`}
      />
      <Container>
        <ModalMessage
          status={status}
          message={message}
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <ContentLocked>
          <FormContainer>
            <Form
              layout="vertical"
              form={form}
              name="register"
              style={{
                maxWidth: 600,
                width: "100%",
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
                  <Form.Item
                    wrapperCol={24}
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
                </Col>
              </FormRow>
              <FormRow>
                <Col span={11}>
                  <Form.Item
                    wrapperCol={24}
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: t("escolherPassword"),
                      },
                      {
                        min: 8,
                        message: t("password8Caracteres"),
                      },
                      {
                        pattern: /[!@#$%^&*(),.?":{}|<>_]/,
                        message: t("passwordSimbolos"),
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    wrapperCol={24}
                    name="confirm"
                    label={t("confirmarPassword")}
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: t("confirmarPasswordError"),
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(t("passwordsDiferentes"))
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </Col>
              </FormRow>
              <FormRow>
                <Col span={24}>
                  <Form.Item
                    wrapperCol={24}
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(new Error(t("confirmarTermos"))),
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
                </Col>
              </FormRow>
              <FormRow>
                <Col span={24}>
                  <Form.Item
                    wrapperCol={24}
                    label="Captcha"
                    extra={t("captchaHumano")}
                  >
                    <ReCAPTCHA
                      // sitekey="6LeeeyEpAAAAAHEmtDr81K8xOhEkbCcM32FGYqtF" //localhost
                      sitekey="6LcGYz8pAAAAAKL8E_B9V_DkFqIXiApSnLnfE4Z0" //production
                      onChange={handleVerification}
                    />
                  </Form.Item>
                </Col>
              </FormRow>
              <FormRow>
                <Col span={24}>
                  <Form.Item wrapperCol={24}>
                    <StyledButton
                      size="large"
                      text={t("registarConta")}
                      type="primary"
                      htmlType="submit"
                      onClick={handleSubmit}
                      loading={loadingButton}
                      disabled={!isVerified || loadingButton} // Disable button if reCAPTCHA is not verified
                    />
                  </Form.Item>
                </Col>
              </FormRow>
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

const FormRow = styled(Row)`
  justify-content: space-between;
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
  min-height: 500px;
`;

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default {
  path: "/registar",
  exact: true,
  component: SignIn,
};
