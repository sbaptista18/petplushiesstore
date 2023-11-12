import styled from "styled-components";
import { Row, Col } from "antd";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

import { useParams } from "react-router-dom";
import {
  Accordion,
  AddToCart,
  Breadcrumbs,
  ImageCarousel,
  ShareSocials,
} from "components";

const flagText = (stock) => {
  let text;
  if (stock > 0) {
    if (stock == 1) text = "last in stock!";
    else if (stock <= 5 && stock != 1) text = "last units in stock!";
  } else text = "out of stock";

  return text;
};

const Product = () => {
  const [product, setProduct] = useState([]);
  const { productUrl } = useParams();

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isFetchingRef.current) {
        isFetchingRef.current = true;

        try {
          const response = await axios.get(
            `https://prestashop.petplushies.pt/api/products?ws_key=VM5DI26GFZN3EZIE4UVUNIVE2UMUGMEA&display=full&filter[link_rewrite]=[${productUrl}]&output_format=JSON`
          );

          const mappedProduct = response.data.products[0];

          const arrayImages = [];
          mappedProduct.associations.images.map((image) => {
            return arrayImages.push(
              `https://prestashop.petplushies.pt/${image.id}-large_default/${mappedProduct.link_rewrite[0].value}.jpg`
            );
          });

          const productData = {
            key: mappedProduct.id,
            name: mappedProduct.name[0].value,
            price: _.toNumber(mappedProduct.price),
            picture: `https://prestashop.petplushies.pt/${mappedProduct.associations.images[0].id}-large_default/${mappedProduct.link_rewrite[0].value}.jpg`,
            slideshow: arrayImages,
            stock: mappedProduct.associations.stock_availables[0].id,
            flag: flagText(mappedProduct.associations.stock_availables[0].id),
            url: mappedProduct.link_rewrite[0].value,
            main_img_id: mappedProduct.associations.images[0].id,
            desc: mappedProduct.description[0].value,
            desc_short: mappedProduct.description_short[0].value,
            sku: mappedProduct.reference,
          };

          setProduct(productData);
        } catch (error) {
          console.log(error);
        }

        isFetchingRef.current = false;
      }
    };

    !isFetchingRef.current && fetchProduct();
  }, [productUrl]);

  return (
    <Container>
      <ContentLocked>
        {product != undefined && (
          <>
            <StyledH1>{product.name}</StyledH1>
            <Breadcrumbs page="/produtos" item={product.name} />
            <StyledRow>
              <Col span={11}>
                <ImageCarousel
                  pictures={[product.slideshow]}
                  settings={{
                    dots: true,
                    infinite: true,
                    speed: 500,
                    //add thumbnails after
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  }}
                />
                <ProductDesc>{product.desc_short}</ProductDesc>
              </Col>
              <Col span={11}>
                <AddToCart sku={product.sku} price={product.price + "€"} />
                <Accordion desc={product.desc} />
                <ShareSocials
                  item={{
                    key: product.key,
                    name: product.name,
                    url: `${product.main_img_id}-large_default/${product.url}.jpg`,
                    picture: product.picture,
                    desc: product.desc_short,
                  }}
                  page="produtos"
                />
              </Col>
            </StyledRow>
          </>
        )}
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
  path: "/produtos/:productUrl",
  exact: true,
  component: Product,
};
