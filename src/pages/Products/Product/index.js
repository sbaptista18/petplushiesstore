import styled from "styled-components";
import { Row, Col } from "antd";

import { useParams } from "react-router-dom";
import {
  Accordion,
  AddToCart,
  Breadcrumbs,
  ImageCarousel,
  ShareSocials,
} from "components";

import { KebabToTitleCase } from "fragments";

import products from "../../../data/products";

function findObjectByProperty(array, propertyName, value) {
  return array.find((item) => item[propertyName] === value);
}

const Product = () => {
  const { productName } = useParams();

  const product = findObjectByProperty(
    products,
    "name",
    KebabToTitleCase(productName)
  );

  return (
    <Container>
      <ContentLocked>
        <StyledH1>{product.name}</StyledH1>
        <Breadcrumbs page="/produtos" item={product.name} />
        <StyledRow>
          <Col span={11}>
            <ImageCarousel
              pictures={[product.picture]}
              settings={{
                dots: true,
                infinite: true,
                speed: 500,
                //add thumbnails after
                slidesToShow: 1,
                slidesToScroll: 1,
              }}
            />
            <ProductDesc>{product.description}</ProductDesc>
          </Col>
          <Col span={11}>
            <AddToCart sku={product.key} price={product.price + "€"} />
            <Accordion />
            <ShareSocials
              item={{
                id: product.key,
                name: product.name,
                url: "https://www.petplushies.pt/produtos/" + productName,
                picture: product.picture,
              }}
              page="produtos"
            />
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

const ProductDesc = styled.div`
  margin-top: 50px;
`;

export default {
  path: "/produtos/:productName",
  exact: true,
  component: Product,
};
