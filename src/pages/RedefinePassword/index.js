import styled from "styled-components";
import { Row, Form, Input } from "antd";
import { useState } from "react";
import axios from "axios";

import { Button, PageHeader, ModalMessage } from "components";
import { useTranslation } from "react-i18next";

import DummyImg from "assets/images/batcat-1.jpg";

const RedefinePassword = () => {
  const [form] = Form.useForm();

  const [loadingButton, setLoadingButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  // Function to reset password
  const resetPassword = async () => {
    setLoadingButton(true);
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();

      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const email = urlParams.get("email");

      try {
        const response = await axios.put(
          `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${email}&code=${code}&new_password=${formValues.password}`
        );

        setMessage(response.data.message);
        setStatus("success");
        setIsModalOpen(true);
        setLoadingButton(false);
      } catch (error) {
        setMessage(error.response.data);
        setStatus("error");
        setIsModalOpen(true);
        setLoadingButton(false);
      }
    });
  };

  return (
    <>
      <ModalMessage
        status={status}
        message={message}
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <PageHeader
        title={`${t("redefinirPassword")}`}
        img={DummyImg}
        alt={`${t("redefinirPassword")} - Pet Plushies`}
      />
      <Container>
        <ContentLocked>
          <div>
            <Form
              form={form}
              name="redefine-password"
              labelCol={{
                span: 5,
              }}
              style={{
                maxWidth: 600,
                width: "100%",
                alignSelf: "center",
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
              <Form.Item>
                <StyledButton
                  size="large"
                  text={t("redefinirPassword")}
                  type="primary"
                  htmlType="submit"
                  loading={loadingButton}
                  disabled={loadingButton}
                />
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
  position: relative;
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
