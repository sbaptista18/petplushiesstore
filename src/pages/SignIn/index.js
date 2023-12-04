import styled from "styled-components";
import { Checkbox, Col, Form, Input, Row } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button, ModalMessage } from "components";
import { ConnectWC } from "fragments";

const SignIn = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(() => {
      const formValues = form.getFieldsValue();
      const data = {
        email: formValues.email,
        first_name: formValues.first_name,
        last_name: formValues.surname,
        username:
          formValues.first_name.toLowerCase() +
          "." +
          formValues.surname.toLowerCase(),
      };

      ConnectWC.post("customers", data)
        .then((response) => {
          setMessage(
            "A sua conta foi criada com sucesso! Pode efectuar o login com o seu nome de utilizador gerado (" +
              formValues.first_name.toLowerCase() +
              "." +
              formValues.surname.toLowerCase() +
              ") e a password que forneceu."
          );
          setStatus("success");
          setIsModalOpen(true);
        })
        .catch((error) => {
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
    <Container>
      <ModalMessage
        status={status}
        message={message}
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ContentLocked>
        <StyledH1>Registar conta</StyledH1>
        <div>
          <Form
            layout="vertical"
            form={form}
            name="register"
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
                          new Error("As passwords nao correspondem.")
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
                              new Error("Tem de aceitar os Termos & Condicoes")
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    Declaro que li os{" "}
                    <Link to="/termos-e-condicoes" target="_blank">
                      Termos & Condicoes
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
        </div>
      </ContentLocked>
    </Container>
  );
};

const FormRow = styled(Row)`
  justify-content: space-between;
`;

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
  path: "/registar",
  exact: true,
  component: SignIn,
};
