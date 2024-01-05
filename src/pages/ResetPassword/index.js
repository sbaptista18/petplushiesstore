import styled from "styled-components";
import { Row, Form, Input } from "antd";
import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

import { Button, PageHeader, ModalMessage } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [loadingButton, setLoadingButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");

  const [form] = Form.useForm();

  // Function to initiate password reset
  const initiatePasswordReset = async () => {
    setLoadingButton(true);
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();

      try {
        const response = await axios.post(
          `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/user/reset_password&email=${formValues.email}`
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
        title={t("recuperarPassword")}
        img={DummyImg}
        alt={`${t("recuperarPassword")} - Pet Plushies`}
      />
      <Container>
        <ContentLocked>
          <Form
            form={form}
            name="initiate-reset-password"
            labelCol={{
              span: 5,
            }}
            style={{
              maxWidth: 600,
              width: "100%",
              alignSelf: "center",
            }}
            onFinish={initiatePasswordReset}
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

            <Form.Item>
              <StyledButton
                size="large"
                text={t("enviarEmailRecuperacao")}
                type="primary"
                htmlType="submit"
                loading={loadingButton}
                disabled={loadingButton}
              />
            </Form.Item>
          </Form>
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
  path: "/recuperar-password",
  exact: true,
  component: ResetPassword,
};
