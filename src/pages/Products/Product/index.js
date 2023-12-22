import styled from "styled-components";
import { Row, Col, Spin, Form, Input, InputNumber } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

import { useCart } from "reducers";
import { getSessionDataFromLocalStorage } from "helpers";
import { PageHeaderProduct } from "components";

import Star from "assets/images/star.svg";

const { TextArea } = Input;
const { useForm } = Form;

import {
  Accordion,
  AddToCart,
  Breadcrumbs,
  ImageCarousel,
  ShareSocials,
  ModalMessage,
  Button,
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
  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(false);
  const [errorReviews, setErrorReviews] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [petName, setPetName] = useState("");
  const [shelter, setShelter] = useState("");
  const [chosenVariations, setChosenVariations] = useState("");
  const [variations, setVariations] = useState(null);
  const [totalPrice, setTotalPrice] = useState();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerEmail, setReviewerEmail] = useState("");
  const [errorRating, setErrorRating] = useState("");
  const [reviews, setReviews] = useState([]);

  const { cartId } = useCart();
  const { updateProductsNr } = useCart();
  const [form] = useForm();

  const handleDataFromChild = (data) => {
    setQty(data);
  };

  const handlePetName = (data) => {
    setPetName(data);
  };

  const handleShelter = (data) => {
    setShelter(data);
  };

  const handleChosenVariations = (data) => {
    setChosenVariations(data);
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

          const options_reviews = {
            method: "GET",
            url: `http://localhost:8000/get_reviews?prodId=${productMainDetails[0].ID}`,
          };

          axios
            .request(options_reviews)
            .then(function (response) {
              setReviews(response.data);
              setLoadingReviews(false);
              setErrorReviews(false);
            })
            .catch(function (error) {
              console.log(error);
              setErrorReviews(true);
            });

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
    let product_extras;
    if (variations != null) {
      function formatData(data) {
        return `<b>${data.radio}:</b> ${data.name};`;
      }

      const variation_aux = chosenVariations.map((c) => {
        return formatData(c);
      });
      const textString = variation_aux.join("\n");

      let finalString;
      if (petName == "" && shelter == "") {
        finalString = textString;
      } else {
        finalString =
          textString +
          "\n<b>Nome do pet:</b> " +
          petName +
          ";\n<b>Associação:</b> " +
          shelter;
      }
      product_extras = finalString;
    } else {
      product_extras = "";
    }

    if (cartId !== null || cartId === 0) {
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
            for (const orderItem of orderItems) {
              totalProductQty += parseInt(orderItem.product_qty, 10);
            }

            updateProductsNr(totalProductQty + qty);
          } else {
            qty_in_cart = 0;
            console.log("qty:", qty);
            console.log("qty in cart:", parseInt(qty_in_cart, 10));
            console.log(parseInt(qty_in_cart, 10) + qty);
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
        product_extras: product_extras,
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

      const qty_input = document.querySelector(".ant-input-number-input").value;

      updateProductsNr(qty_input);

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
          console.log("create cart response:", response);
          const dataProduct = {
            temp_cart_id: response.data.success.id,
            product_id: product.id,
            date_created: new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            product_qty: qty_input,
            product_net_revenue: qty_input * totalPrice,
            product_extras: product_extras,
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
          console.log(error);
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

  const handleReview = (e) => {
    setReview(e.target.value);
  };

  const handleRating = (rating) => {
    setRating(rating);
  };

  const handleMouseEnter = (hoveredRating) => {
    setHoveredRating(hoveredRating);
  };

  const handleReviewerName = (name) => {
    setReviewerName(name);
  };

  const handleReviewerEmail = (email) => {
    setReviewerEmail(email);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
    if (rating === 0) {
      setRating(0);
    }
  };

  const handleSubmitReview = (review, rating, reviewerName, reviewerEmail) => {
    if (rating == 0) setErrorRating("Tem de fornecer uma pontuação.");
    else {
      form
        .validateFields()
        .then(() => {
          const reviewData = {
            product_id: product.id,
            review: review,
            reviewer:
              reviewerName == "" ? "Anónimo" : reviewerName.target.value,
            reviewer_email: reviewerEmail.target.value,
            rating: rating,
            status: "hold",
          };

          const options = {
            method: "POST",
            url: `http://localhost:8000/reviews`,
            data: JSON.stringify({ reviewData }),
            headers: {
              "Content-Type": "application/json",
            },
          };

          axios
            .request(options)
            .then(function (response) {
              setMessage(
                "Avaliação de produto submetida com sucesso! A nossa equipa aprovará assim que possível."
              );
              setStatus("success");
              setIsModalOpen(true);

              setTimeout(() => {
                window.location.reload();
              }, 3000);
            })
            .catch(function (error) {
              setMessage(
                "Houve um erro ao submeter a avaliação do produto. (" +
                  error +
                  ".)"
              );
              setStatus("error");
              setIsModalOpen(true);
            });
        })
        .catch((error) => {
          console.log(error);
          console.error("Erro na validação de campos:", error);
        });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {loading && !error && (
        <Spinner
          indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
        />
      )}
      {error && !loading && <>Erro ao carregar o produto.</>}
      {product != undefined && (
        <>
          <PageHeaderProduct title={product.name} />
          <Container>
            <ModalMessage
              status={status}
              message={message}
              isVisible={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            <ContentLocked>
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
                    name={product.name}
                  />

                  {product.flag != undefined && <Flag>{product.flag}</Flag>}

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
                    onPetName={handlePetName}
                    onShelter={handleShelter}
                    onChosenVariations={handleChosenVariations}
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
              <ReviewSecion>
                <Row>
                  <h3>Avaliações</h3>
                </Row>
                <ReviewsContent>
                  <Col span={7}>
                    <div>
                      <StyledForm
                        form={form}
                        name="reviews"
                        layout="vertical"
                        scrollToFirstError
                      >
                        <FormRow>
                          <Form.Item name="rating" wrapperCol={24}>
                            <>
                              <InputNumber
                                value={rating}
                                style={{ display: "none" }}
                              />
                              <StarsContainer>
                                <p>Pontuação:</p>
                                {[1, 2, 3, 4, 5].map((index) => (
                                  <StyledStar
                                    key={index}
                                    filled={
                                      index <= rating || index <= hoveredRating
                                        ? "true"
                                        : "false"
                                    }
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => handleRating(index)}
                                  />
                                ))}
                              </StarsContainer>
                              <ErrorRating>{errorRating}</ErrorRating>
                            </>
                          </Form.Item>
                        </FormRow>
                        <FormRow>
                          <StyledFormItem
                            name="review"
                            wrapperCol={24}
                            rules={[
                              {
                                required: true,
                                message: "Por favor escreva a sua avaliação.",
                              },
                            ]}
                          >
                            <StyledTextarea
                              onChange={handleReview}
                              rows={4}
                              placeholder="Escreva aqui a sua avaliação..."
                            />
                          </StyledFormItem>
                        </FormRow>
                        <FormRow>
                          <StyledFormItem
                            name="reviewer_name"
                            wrapperCol={24}
                            label="Nome"
                          >
                            <Input
                              onChange={handleReviewerName}
                              placeholder="Escreva aqui o seu nome..."
                            />
                          </StyledFormItem>
                        </FormRow>
                        <FormRow>
                          <StyledFormItem
                            name="reviewer_email"
                            wrapperCol={24}
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
                            <Input
                              onChange={handleReviewerEmail}
                              placeholder="Escreva aqui o seu e-mail..."
                            />
                          </StyledFormItem>
                        </FormRow>
                        <FormRow>
                          <StyledButton
                            size="large"
                            type="primary"
                            text="Submeter avaliação"
                            onClick={() =>
                              handleSubmitReview(
                                review,
                                rating,
                                reviewerName,
                                reviewerEmail
                              )
                            }
                          />
                        </FormRow>
                      </StyledForm>
                    </div>
                  </Col>
                  <ReviewsContainer span={17}>
                    {loadingReviews && !errorReviews && (
                      <SpinnerReviews
                        indicator={
                          <LoadingOutlined style={{ fontSize: 50 }} spin />
                        }
                      />
                    )}
                    {errorReviews && !loadingReviews && (
                      <>Erro ao carregar as avaliações.</>
                    )}
                    {reviews.length > 0 ? (
                      reviews.map((r) => {
                        return (
                          <Review key={r.id}>
                            <div>
                              Avaliado em:{" "}
                              <b>
                                {moment(r.date_created_gmt).format(
                                  "MMMM Do YYYY"
                                )}
                              </b>
                            </div>
                            <StarRatingContainer>
                              {[1, 2, 3, 4, 5].map((index) => (
                                <StyledStarRating
                                  key={index}
                                  filled={index <= r.rating ? "true" : "false"}
                                />
                              ))}
                            </StarRatingContainer>
                            <div>
                              {r.name == "Anonimo" ? (
                                <b>{r.name}</b>
                              ) : (
                                <>
                                  <b>{r.name}</b> ({r.email})
                                </>
                              )}
                            </div>
                            <ReviewText>{r.review}</ReviewText>
                          </Review>
                        );
                      })
                    ) : (
                      <>
                        Não existem avaliações para este produto. A sua pode ser
                        a primeira!
                      </>
                    )}
                  </ReviewsContainer>
                </ReviewsContent>
              </ReviewSecion>
            </ContentLocked>
          </Container>
        </>
      )}
    </div>
  );
};

const ReviewsContainer = styled(Col)`
  position: relative;
`;

const Review = styled.div`
  border-bottom: 1px solid black;
  display: flex;
  flex-direction: column;
  padding: 15px 0;
`;

const ErrorRating = styled.div`
  color: red;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
`;

const ReviewSecion = styled(Row)`
  flex-direction: column;
`;

const ReviewsContent = styled(Row)`
  justify-content: space-between;
`;

const StyledForm = styled(Form)`
  width: 300px;
`;

const FormRow = styled(Row)`
  width: 100%;
`;

const StarsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 210px;

  & > p {
    margin: 0;
  }
`;

const StyledStar = styled(Star)`
  width: 20px;
  height: auto;
  cursor: pointer;
  transition: 0.5s;
  fill: #fff;
  stroke: #ed8a19;
  stroke-width: 4;

  &:hover {
    fill: #ed8a19;
  }

  &[filled="true"] {
    fill: #ed8a19;
  }
`;

const StarRatingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 140px;
  padding: 10px 0;
`;

const StyledStarRating = styled(Star)`
  width: 20px;
  height: auto;
  fill: #fff;
  stroke: #ed8a19;
  stroke-width: 4;

  &[filled="true"] {
    fill: #ed8a19;
  }
`;

const StyledFormItem = styled(Form.Item)`
  width: 100%;
`;

const StyledTextarea = styled(TextArea)`
  width: 100%;
`;

const ReviewText = styled.div`
  margin-top: 10px;
`;

const SpinnerReviews = styled(Spin)`
  position: absolute;
  background-color: white;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
  background-color: white;
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
  z-index: 0;
  font-size: 14px;
  padding: 5px 10px;
`;

export default {
  path: "/produtos/:productUrl",
  exact: true,
  component: Product,
};
