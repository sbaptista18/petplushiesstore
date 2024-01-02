import { Row, Col, Form, Checkbox, Input } from "antd";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { Button } from "components";

const AccountDataForm = ({
  form,
  disabled,
  setDisabled,
  handleSubmitAccountData,
  loadingButton,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Checkbox
        checked={disabled}
        onChange={(e) => setDisabled(e.target.checked)}
      >
        {t("modoEdicao")}
      </Checkbox>

      <Form
        layout="vertical"
        form={form}
        name="change_email"
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
        disabled={!disabled}
      >
        <FormRow>
          <Col span={24}>
            <Form.Item
              wrapperCol={24}
              name="name"
              label={t("nome")}
              rules={[
                {
                  max: 15,
                  message: `${t("nome15Caracteres")}`,
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
                  message: `${t("emailInvalido")}`,
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
                  min: 8,
                  message: `${t("password8Caracteres")}`,
                },
                {
                  pattern: /[!@#$%^&*(),.?":{}|<>_]/,
                  message: `${t("passwordSimbolos")}`,
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
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("passwordsDiferentes")));
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
            <Form.Item wrapperCol={24}>
              <StyledButton
                size="large"
                text={t("actualizarDadosConta")}
                type="primary"
                htmlType="submit"
                onClick={handleSubmitAccountData}
                loading={loadingButton}
                disabled={loadingButton}
              />
            </Form.Item>
          </Col>
        </FormRow>
      </Form>
    </div>
  );
};

const FormRow = styled(Row)`
  justify-content: space-between;
`;

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default AccountDataForm;
