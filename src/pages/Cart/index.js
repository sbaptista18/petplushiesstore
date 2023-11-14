import styled from "styled-components";
import { Row, Col, Table } from "antd";

import { Button } from "components";

import products from "./mock_products";
import table_render from "./table_render";

const Cart = () => {
  return (
    <Container>
      <ContentLocked>
        <StyledH1>Carrinho</StyledH1>
        <StyledRow>
          <Col span={15}>
            <Title>O meu carrinho</Title>
            <Border />
            <StyledTable
              columns={table_render}
              dataSource={products}
              pagination={false}
            />
          </Col>
          <Col span={5}>
            <Title>Resumo da compra</Title>
            <Border />
            <Subtotal>
              <div>Subtotal</div>
              <div>100&euro;</div>
            </Subtotal>
            <Shipping>
              <div>Estimativa de portes</div>
              <div>20&euro;</div>
            </Shipping>
            <Border />
            <Total>
              <div>Subtotal</div>
              <div>120&euro;</div>
            </Total>
            <StyledButton size="large" type="primary" text="Finalizar compra" />
          </Col>
        </StyledRow>
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
  margin-bottom: 50px;
`;

const StyledH1 = styled.h1`
  position: absolute;
  left: -200%;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
  margin-top: 50px;
`;

const StyledTable = styled(Table)`
  && {
    & .ant-table-thead > tr > th {
      background-color: transparent;
      border-color: black;

      &:before {
        display: none;
      }
    }

    & .ant-table-row {
      height: 200px;
    }

    & .ant-table-cell {
      border-color: black;
    }
  }
`;

const Title = styled.p`
  font-size: 19px;
`;

const Border = styled.div`
  height: 1px;
  width: 100%;
  background-color: black;
  margin-bottom: 30px;
`;

const Subtotal = styled(Row)`
  justify-content: space-between;
`;

const Shipping = styled(Subtotal)``;

const Total = styled(Subtotal)`
  font-size: 20px;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

export default {
  path: "/carrinho",
  exact: true,
  component: Cart,
};
