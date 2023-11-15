import styled from "styled-components";
import { Row, Form, Input } from "antd";
import { Button } from "components";

const SignIn = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Container>
      <ContentLocked>
        <StyledH1>Registar conta</StyledH1>
        <div>
          <Form
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Nome de utilizador"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Por favor insira o nome de utilizador!",
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
              label="Confirmar password"
              name="conf-password"
              rules={[
                {
                  required: true,
                  message: "Por favor confirme a password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="E-mail"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Por favor insira um e-mail valido!",
                  type: "email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <StyledButton
                size="large"
                color="green"
                text="Registar conta"
                type="primary"
                htmlType="submit"
              />
            </Form.Item>
          </Form>
        </div>
      </ContentLocked>
    </Container>
  );
};

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
