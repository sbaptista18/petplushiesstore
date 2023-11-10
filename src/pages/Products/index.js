import styled from "styled-components";
import { Row, Col, Collapse, Slider } from "antd";

import { Breadcrumbs, TileNoInput } from "components";

import products from "../../data/products";

const { Panel } = Collapse;

const flagText = (stock) => {
  let text;
  if (stock > 0) {
    if (stock == 1) text = "last in stock!";
    if (stock <= 5 && stock > 1) text = "last units in stock!";
  } else text = "out of stock";

  return text;
};

const marks = {
  0: "0€",
  100: "100€",
};

const Products = () => {
  return (
    <Container>
      <ContentLocked>
        <StyledH1>Produtos</StyledH1>
        <Breadcrumbs page="/" item="Produtos" />
        <StyledRow>
          <Col span={6}>
            <Span>Filtrar por:</Span>
            <Collapse defaultActiveKey={["1"]} accordion>
              <Panel header="Categoria" key="1">
                <ul>
                  <li>Cat 1</li>
                  <li>Cat 2</li>
                  <li>Cat 3</li>
                  <li>Cat 4</li>
                </ul>
              </Panel>
              <Panel header="Preco" key="2">
                <Slider range marks={marks} defaultValue={[10, 20]} />
              </Panel>
            </Collapse>
          </Col>
          <Col span={16}>
            <ProductRow>
              {products.map((p) => {
                return (
                  <TileNoInput
                    key={p.key}
                    name={p.name}
                    price={p.price}
                    picture={p.picture}
                    stock={p.stock}
                    flag={flagText(p.stock)}
                  />
                );
              })}
            </ProductRow>
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
`;

const StyledH1 = styled.h1`
  margin-top: 30px;
  font-size: 52px;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
`;

const ProductRow = styled(Row)`
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Span = styled.span`
  display: block;
  margin-bottom: 15px;
`;

export default {
  path: "/produtos",
  exact: true,
  component: Products,
};
