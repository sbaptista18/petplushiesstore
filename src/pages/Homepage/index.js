import styled from "styled-components";
import { Row, Col } from "antd";
import {
  Accordion,
  AddToCart,
  Breadcrumbs,
  Button,
  ImageCarousel,
  ShareSocials,
  Slideshow,
  Tile,
  TileNoInput,
} from "components";

import Image1 from "assets/images/batcat-1.jpg";

const Homepage = () => {
  return (
    <Container>
      <Slideshow
        settings={{
          dots: true,
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 5000,
        }}
      />
      <ContentLocked>
        <h1>Homepage</h1>
        <Breadcrumbs page="homepage" item="page" />
        <StyledButton
          size="large"
          color="green"
          text="click here"
          type="primary"
        />
        <Row
          style={{
            display: "flex",
          }}
        >
          <Tile
            flag="sale"
            category="plushies"
            title="this is a plushie"
            price="10&euro;"
            sale_price="7.5&euro;"
            picture={Image1}
            size="large"
          />
          <Tile
            category="keychains"
            title="this is a keychain"
            price="7.5&euro;"
            picture={Image1}
            size="small"
          />
        </Row>
        <Row
          style={{
            display: "flex",
          }}
        >
          <TileNoInput
            category="keychains"
            title="this is a keychain"
            price="7.5&euro;"
            picture={Image1}
            size="large"
          />
          <TileNoInput
            category="keychains"
            title="this is a keychain"
            price="7.5&euro;"
            picture={Image1}
            size="small"
          />
        </Row>
        <Row>
          <Col span={11}>
            <ImageCarousel
              settings={{
                dots: true,
                infinite: true,
                speed: 500,
                //add thumbnails after
                slidesToShow: 1,
                slidesToScroll: 1,
              }}
            />
            <div>
              I'm a product description. This is a great place to "sell" your
              product and grab buyers' attention. Describe your product clearly
              and concisely. Use unique keywords. Write your own description
              instead of using manufacturers' copy.
            </div>
          </Col>
          <Col span={11}>
            <AddToCart
              title="A product"
              sku="A ref"
              price="10&euro;"
              sale_price="7.5&euro;"
              flag="sale"
            />
            <Accordion />
            <ShareSocials
              item={{
                id: 1,
                name: "a product",
                url: "",
                picture: Image1,
              }}
              page="product"
            />
          </Col>
        </Row>
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

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default {
  path: "/",
  exact: true,
  component: Homepage,
};
