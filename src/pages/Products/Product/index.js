import styled from "styled-components";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { useCart } from "reducers";
import { getSessionDataFromLocalStorage } from "helpers";

import {
  Accordion,
  AddToCart,
  Breadcrumbs,
  ImageCarousel,
  ShareSocials,
  ModalMessage,
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
  const [sessionKey, setSessionKey] = useState(null);
  const [product, setProduct] = useState([]);
  const { productUrl } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { cartId } = useCart();

  useEffect(() => {
    if (cartId === null) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [cartId]);

  useEffect(() => {
    const fetchProduct = async () => {
      const options = {
        method: "GET",
        url: `http://localhost:8000/products`,
      };

      axios
        .request(options)
        .then((response) => {
          const productWithSlug = response.data.find(
            (product) => product.slug === productUrl
          );

          const arrayImages = [];

          productWithSlug.images.map((image) => {
            return arrayImages.push(image.src);
          });

          const productData = {
            id: productWithSlug.id,
            name: productWithSlug.name,
            price: _.toNumber(productWithSlug.price),
            picture: productWithSlug.images[0].src,
            slideshow: arrayImages,
            stock: productWithSlug.stock_quantity,
            flag: flagText(productWithSlug.stock_quantity),
            url: productWithSlug.slug,
            desc: productWithSlug.description,
            desc_short: productWithSlug.short_description,
            sku: productWithSlug.sku,
          };

          setProduct(productData);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
        });
    };

    fetchProduct();
  }, [productUrl]);

  const addToCart = async (product) => {
    if (cartId || cartId === 0) {
      const qty = document.querySelector(".ant-input-number-input").value;
      const dataProduct = {
        temp_cart_id: cartId,
        product_id: product.id,
        date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
        product_qty: qty,
        product_net_revenue: product.price * qty,
      };

      const options = {
        method: "GET",
        url: `http://localhost:8000/products`,
      };

      axios
        .request(options)
        .then((response) => {
          const options1 = {
            method: "POST",
            url: `http://localhost:8000/temp_cart_products`,
            data: JSON.stringify({ dataProduct }),
            headers: {
              "Content-Type": "application/json",
            },
          };

          axios
            .request(options1)
            .then(function (response) {
              setMessage("Product was added to cart!");
              setStatus("success");
              setIsModalOpen(true);
            })
            .catch(function (error) {
              setMessage(
                "There was an error adding product to cart. (" + error + ".)"
              );
              setStatus("error");
              setIsModalOpen(true);
            });
        })
        .catch((error) => {
          setMessage(
            "There was an error fetching cart products. (" +
              error.response +
              ".)"
          );
          setStatus("error");
          setIsModalOpen(true);
        });
    } else {
      const storedUserData = localStorage.getItem("user");

      const dataCart = {
        status: "active",
        local_session_key: sessionKey,
        date_created_gmt: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        date_updated_gmt: new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        currency: "EUR",
        ip_address: "",
        user_agent: navigator.userAgent,
        is_user_cart: storedUserData ? 1 : 0,
      };

      const options1 = {
        method: "POST",
        url: `http://localhost:8000/temp_carts`,
        data: JSON.stringify({ dataCart }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .request(options1)
        .then(function (response) {
          const dataProduct = {
            temp_cart_id: response.data.success.id,
            product_id: product.id,
            date_created: new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            product_qty: document.querySelector(".ant-input-number-input")
              .value,
            product_net_revenue: product.price,
          };

          const options1 = {
            method: "POST",
            url: `http://localhost:8000/temp_cart_products`,
            data: JSON.stringify({ dataProduct }),
            headers: {
              "Content-Type": "application/json",
            },
          };

          axios
            .request(options1)
            .then(function (response) {
              console.log(response);
              setMessage("Product was added to cart!");
              setStatus("success");
              setIsModalOpen(true);
            })
            .catch(function (error) {
              setMessage(
                "There was an error adding product to cart. (" +
                  error.response +
                  ".)"
              );
              setStatus("error");
              setIsModalOpen(true);
            });
        })
        .catch(function (error) {
          setMessage(
            "There was an error creating the cart. (" + error.response + ".)"
          );
          setStatus("error");
          setIsModalOpen(true);
        });
    }
  };

  useEffect(() => {
    const storedSessionData = getSessionDataFromLocalStorage();
    setSessionKey(storedSessionData.key);
  }, []);

  return (
    <Container>
      <ModalMessage
        status={status}
        message={message}
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ContentLocked>
        {loading && !error && (
          <Spinner
            indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          />
        )}
        {error && !loading && <>Error fetching product.</>}
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
                <ProductDesc
                  dangerouslySetInnerHTML={{ __html: product.desc_short }}
                />
              </Col>
              <Col span={11}>
                <AddToCart
                  onClick={() => addToCart(product)}
                  sku={product.sku}
                  price={product.price + "€"}
                />
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

const Spinner = styled(Spin)`
  position: absolute;
  background-color: white;
  width: 99vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
