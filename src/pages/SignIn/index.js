import styled from "styled-components";
import { Checkbox, Col, Form, Input, Row } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button, ModalMessage, PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const SignIn = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(() => {
      const formValues = form.getFieldsValue();
      const dataCustomer = {
        email: formValues.email,
        first_name: formValues.first_name,
        last_name: formValues.surname,
        username:
          formValues.first_name.toLowerCase() +
          "." +
          formValues.surname.toLowerCase(),
        role: "customer",
      };

      const options = {
        method: "POST",
        url: `//localhost:8000/customers`,
        data: JSON.stringify({ dataCustomer }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          setMessage(
            "A sua conta foi criada com sucesso! Pode efectuar o login com o seu nome de utilizador gerado (" +
              formValues.first_name.toLowerCase() +
              "." +
              formValues.surname.toLowerCase() +
              "). Receberá instruções para definir a sua password."
          );
          setStatus("success");
          setIsModalOpen(true);
        })
        .catch(function (error) {
          setMessage(
            "Houve um erro na criacao da conta. Por favor envie e-mail para geral@petplushies.pt para notificar do sucedido. (" +
              error.response.data +
              ".)"
          );
          setStatus("error");
          setIsModalOpen(true);
        });
    });
  };

  const handleVerification = (value) => {
    setIsVerified(value);
  };

  return (
    <>
      <PageHeader
        title="Registar conta"
        img={DummyImg}
        alt="Registar conta - Pet Plusies"
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
                  <Form.Item
                    wrapperCol={24}
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
                        message: "Por favor escolha a sua password.",
                      },
                      {
                        min: 8,
                        message: "A password deve ter pelo menos 8 caracteres.",
                      },
                      {
                        pattern: /[!@#$%^&*(),.?":{}|<>_]/,
                        message: "A password deve incluir símbolos.",
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
                    label="Confirmar Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Por favor confirme a password que escolheu.",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("As passwords não correspondem.")
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
                            : Promise.reject(
                                new Error(
                                  "Tem de aceitar os Termos & Condições"
                                )
                              ),
                      },
                    ]}
                  >
                    <Checkbox>
                      Declaro que li os{" "}
                      <Link to="/termos-e-condicoes" target="_blank">
                        Termos & Condições
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
                    extra="Só queremos ter a certeza que é um humano."
                  >
                    <ReCAPTCHA
                      sitekey="6LeeeyEpAAAAAHEmtDr81K8xOhEkbCcM32FGYqtF"
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
                      text="Registar conta"
                      type="primary"
                      htmlType="submit"
                      onClick={handleSubmit}
                      disabled={!isVerified} // Disable button if reCAPTCHA is not verified
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
