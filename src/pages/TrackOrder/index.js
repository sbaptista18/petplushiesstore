import styled from "styled-components";
import { Row, Col, Spin, Form, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";

import { Button, PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

moment.locale("pt");

const TrackOrder = () => {
  const [order, serOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();

  const fetchOrder = async (values) => {
    const email = values.email;
    const order_id = values.order_id;
    setLoading(true);

    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/track_order?email=${email}&order_id=${order_id}`
      );
      const data = await response.json();

      if (data.success) {
        serOrder(data.data);
        setLoading(false);
        setError(false);
      } else {
        setError(true);
        setLoading(false);
        setMessage(data.message);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      setMessage(data.message);
    }
  };

  const handleStatusText = (text) => {
    let status;
    switch (text) {
      case "on-hold":
        status = "Aguarda confirmação de pagamento";
        break;
      case "processing":
        status = "Em processamento";
        break;
      case "shipment-sent":
        status = "Encomenda enviada";
        break;
      default:
        status = "default";
        break;
    }
    return <div>{status}</div>;
  };

  return (
    <>
      <PageHeader
        title="Seguir Encomenda"
        img={DummyImg}
        alt="Seguir Encomenda - Pet Plushies"
      />
      <Container>
        <ContentLocked>
          <FormContainer>
            <Form
              form={form}
              name="track-order"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
                width: "100%",
              }}
              onFinish={(values) => fetchOrder(values)}
              autoComplete="off"
            >
              <Form.Item
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

              <Form.Item
                label="Numero de encomenda"
                name="order_id"
                rules={[
                  {
                    required: true,
                    message: "Por favor insira o numero de encomenda !",
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
                  text="Seguir encomenda"
                  type="primary"
                  htmlType="submit"
                />
              </Form.Item>
            </Form>
          </FormContainer>
        </ContentLocked>
        <ContentLocked>
          <OrderContainer>
            {loading && !error && (
              <Spinner
                indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
              />
            )}
            {error && !loading && (
              <div style={{ textAlign: "center", width: "100%" }}>
                {message}
              </div>
            )}
            {!error && !loading && Object.keys(order).length !== 0 && (
              <>
                <TableHeader style={{ width: "100%" }}>
                  <Col span={6}>Numero da encomenda</Col>
                  <Col span={6}>Data</Col>
                  <Col span={6}>Estado</Col>
                  <Col span={6}>Total</Col>
                </TableHeader>
                <Row style={{ width: "100%" }}>
                  <Col span={6}>{order.number}</Col>
                  <Col span={6}>
                    {moment(order.date).format(
                      "DD [de] MMMM [de] YYYY[, às] HH:mm"
                    )}
                  </Col>
                  <Col span={6}>{handleStatusText(order.status)}</Col>
                  <Col span={6}>{order.total}&euro;</Col>
                </Row>
              </>
            )}
          </OrderContainer>
        </ContentLocked>
      </Container>
    </>
  );
};

const TableHeader = styled(Row)`
  font-weight: 600;
  font-size: 18px;
`;

const FormContainer = styled.div`
  padding: 65px 0;
  display: flex;
  justify-content: center;
`;

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

const Spinner = styled(Spin)`
  background-color: var(--white);
  width: 100%;
  height: 100%;
  position: relative;
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

const OrderContainer = styled(Row)`
  display: flex;
  position: relative;
  align-items: center;
  flex-wrap: wrap;
  min-height: 200px;
`;

export default {
  path: "/seguir-encomenda",
  exact: true,
  component: TrackOrder,
};
