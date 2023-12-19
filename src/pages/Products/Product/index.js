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

const flagText = (stock, status) => {
  let text;

  if (status == "instock") {
    if (stock == null) return;
    if (stock > 0) {
      if (stock == 1) text = "Apenas 1 em stock!";
      if (stock <= 5 && stock != 1) text = "Últimas unidades em stock!";
    }
  } else {
    text = "Esgotado";
  }

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
  const [qty, setQty] = useState(1);
  const [variations, setVariations] = useState(null);
  const [totalPrice, setTotalPrice] = useState();

  const { cartId } = useCart();
  const { updateProductsNr } = useCart();

  const handleDataFromChild = (data) => {
    setQty(data);
  };

  const getTotalPrice = (data) => {
    setTotalPrice(data);
  };

  useEffect(() => {
    if (cartId === null) {
      setLoading(true);
    }
  }, [cartId]);

  useEffect(() => {
    const fetchProduct = async () => {
      const options = {
        method: "GET",
        url: `http://localhost:8000/product/product_slug?product_slug=${productUrl}`,
      };

      axios
        .request(options)
        .then((response) => {
          const productMainDetails = response.data.results.product_main_details;
          const productDetails = response.data.results.product_details;
          const productImages = response.data.results.product_images;
          const productVariations = response.data.results.product_variations;

          if (productVariations === undefined) {
            setVariations(null);
          } else {
            setVariations(productVariations);
          }

          // Define the gallery array
          const urls = productImages.map((image) => image.guid);

          // price
          const productPrice = productDetails.find(
            (meta) => meta.meta_key === "_price"
          );

          // stock
          const productStock = productDetails.find(
            (meta) => meta.meta_key === "_stock"
          );
          const productStockStatus = productDetails.find(
            (meta) => meta.meta_key === "_stock_status"
          );

          // sku
          const productSKU = productDetails.find(
            (meta) => meta.meta_key === "_sku"
          );

          // weight
          const productWeight = productDetails.find(
            (meta) => meta.meta_key === "_weight"
          );

          const productData = {
            id: productMainDetails[0].ID,
            name: productMainDetails[0].post_title,
            price: _.toNumber(productPrice.meta_value),
            picture: urls[0],
            slideshow: urls,
            stock: productStock.meta_value,
            stock_status: productStockStatus.meta_value,
            flag: flagText(
              productStock.meta_value,
              productStockStatus.meta_value
            ),
            url: productMainDetails[0].post_name,
            desc: productMainDetails[0].post_content,
            desc_short: productMainDetails[0].post_excerpt,
            sku: productSKU.meta_value.toString(),
            weight: productWeight.meta_value,
          };

          setProduct(productData);

          setTimeout(() => {
            setLoading(false);
          }, 1000);
        })
        .catch((error) => {
          setError(true);
        });
    };

    fetchProduct();
  }, [productUrl]);

  const addToCart = async (product) => {
    if (cartId || cartId === 0) {
      //Update number in cart (header)
      const options_prods = {
        method: "GET",
        url: `http://localhost:8000/temp_cart_products_id?cartId=${cartId}`,
      };

      axios
        .request(options_prods)
        .then(function (response) {
          updateProductsNr(0);
          let qty_in_cart;

          let totalProductQty = 0;
          const orderItems = response.data.results;

          if (orderItems != undefined) {
            console.log("there are products in the cart");

            for (const orderItem of orderItems) {
              totalProductQty += parseInt(orderItem.product_qty, 10);
            }

            updateProductsNr(totalProductQty + qty);
          } else {
            console.log("there are no products in the cart");
            qty_in_cart = 0;
            updateProductsNr(parseInt(qty_in_cart, 10) + qty);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      //End

      const dataProduct = {
        temp_cart_id: cartId,
        product_id: product.id,
        date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
        product_qty: qty,
        product_net_revenue: totalPrice * qty,
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
          setMessage("O produto foi adicionado ao carrinho!");
          setStatus("success");
          setIsModalOpen(true);
        })
        .catch(function (error) {
          setMessage(
            "Houve um erro ao adicionar o produto ao carrinho. (" + error + ".)"
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

      updateProductsNr(1);

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
            product_net_revenue: totalPrice,
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
              setMessage("O produto foi adicionado ao carrinho!");
              setStatus("success");
              setIsModalOpen(true);
            })
            .catch(function (error) {
              setMessage(
                "Houve um erro ao adicionar um produto ao carrinho. (" +
                  error.response +
                  ".)"
              );
              setStatus("error");
              setIsModalOpen(true);
            });
        })
        .catch(function (error) {
          setMessage(
            "Houve um erro ao criar o carrinho. (" + error.response + ".)"
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
        {error && !loading && <>Erro ao carregar o produto.</>}
        {product != undefined && (
          <>
            <StyledH1>{product.name}</StyledH1>
            <Breadcrumbs page="/produtos" item={product.name} />
            <StyledRow>
              <Col span={11}>
                {product.flag != undefined && <Flag>{product.flag}</Flag>}

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
                  name={product.name}
                />
                <ProductDesc
                  dangerouslySetInnerHTML={{ __html: product.desc_short }}
                />
              </Col>
              <Col span={11}>
                <AddToCart
                  onClick={() => addToCart(product)}
                  sku={product.sku}
                  price={product.price}
                  stock={product.stock_status}
                  onDataFromChild={handleDataFromChild}
                  variations={variations}
                  onUpdateTotalPrice={getTotalPrice}
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
  width: 100%;
  height: 100%;
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
  position: relative;
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

const Flag = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: auto;
  height: 30px;
  background-color: var(--black);
  color: var(--white);
  z-index: 1;
  font-size: 14px;
  padding: 5px 10px;
`;

export default {
  path: "/produtos/:productUrl",
  exact: true,
  component: Product,
};
