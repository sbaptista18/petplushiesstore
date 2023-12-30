import { Row, Col, Form, Checkbox, Input } from "antd";
import styled from "styled-components";

import { Button } from "components";

const AccountDataForm = ({
  form,
  disabled,
  setDisabled,
  handleSubmitAccountData,
  loadingButton,
}) => {
  return (
    <div>
      <Checkbox
        checked={disabled}
        onChange={(e) => setDisabled(e.target.checked)}
      >
        Modo de edição
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
              label="Nome"
              rules={[
                {
                  max: 15,
                  message: "O nome não pode ter mais de 15 caracteres.",
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
            <Form.Item wrapperCol={24}>
              <StyledButton
                size="large"
                text="Actualizar dados da conta"
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
