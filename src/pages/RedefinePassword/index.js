import styled from "styled-components";
import { Row, Form, Input } from "antd";
import { useState } from "react";
import axios from "axios";

import { Button, PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const RedefinePassword = () => {
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  // Function to reset password
  const resetPassword = async () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const email = urlParams.get("email");

      try {
        const response = await axios.put(
          `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${email}&code=${code}&new_password=${formValues.password}`
        );
        setError(response.data.message);
      } catch (error) {
        setError(error.response.data);
      }
    });
  };

  return (
    <>
      <PageHeader
        title="Redefinir password"
        img={DummyImg}
        alt="Redefinir password - Pet Plushies"
      />
      <Container>
        <ContentLocked>
          <div>
            <Form
              form={form}
              name="redefine-password"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              onFinish={resetPassword}
              autoComplete="off"
            >
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
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <StyledButton
                  size="large"
                  text="Redefinir password"
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
    </>
  );
};

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
  path: "/redefinir-password",
  exact: true,
  component: RedefinePassword,
};
