import styled from "styled-components";
import { Row, Col, Spin, Form, Input, InputNumber } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

import { useCart } from "reducers";
import { getSessionDataFromLocalStorage } from "helpers";
import { SEOTags } from "fragments";

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
  PageHeaderProduct,
} from "components";

moment.locale("pt");

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
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
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
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingButton, setLoadingButton] = useState(false);

  const { cartId } = useCart();
  const { updateProductsNr } = useCart();
  const { isLoggedIn } = useCart();
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
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_product_by_slug?slug=${productUrl}`
        );
        const data = await response.json();

        const productMainDetails = data.results.product_main_details[0];
        const productDetails = data.results.product_details;
        const productImages = data.results.product_images;
        const productVariations = data.results.product_variations;

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
          id: productMainDetails.ID,
          name: productMainDetails.post_title,
          price: _.toNumber(productPrice.meta_value),
          picture: urls[0],
          slideshow: urls,
          stock: productStock.meta_value,
          stock_status: productStockStatus.meta_value,
          flag: flagText(
            productStock.meta_value,
            productStockStatus.meta_value
          ),
          url: productMainDetails.post_name,
          desc: productMainDetails.post_content,
          desc_short: productMainDetails.post_excerpt,
          sku: productSKU.meta_value.toString(),
          weight: productWeight.meta_value,
        };

        setProduct(productData);

        try {
          const response = await fetch(
            `https://backoffice.petplushies.pt/wp-json/wc/v3/get_reviews?prodId=${productMainDetails.ID}`
          );
          const data = await response.json();
          if (data.success) {
            setReviews(data.results.product_reviews);
            setLoadingReviews(false);

            let sum = 0;
            const reviewsCount = data.results.product_reviews.length;
            setTotalReviews(reviewsCount);
            data.results.product_reviews.forEach((review) => {
              const rating = parseFloat(review.rating.rating[0]);
              if (!isNaN(rating)) {
                sum += rating;
              }
            });
            const averageRating = reviewsCount > 0 ? sum / reviewsCount : 0;
            setAvgRating(averageRating.toFixed(1));

            setErrorReviews(false);
          } else {
            setErrorReviews(true);
          }

          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } catch (error) {
          setError(true);
        }
      } catch (error) {
        setError(true);
      }
    };

    fetchProduct();
  }, [productUrl]);

  const formatVariations = (chosenVariations, petName, shelter) => {
    if (!chosenVariations) return "";

    function formatData(data) {
      return `<b>${data.radio}:</b> ${data.name};`;
    }

    const variationString = chosenVariations.map(formatData).join("\n");

    if (petName === "" && shelter === "") {
      return variationString;
    } else {
      return `${variationString}\n<b>Nome do pet:</b> ${petName};\n<b>Associação:</b> ${shelter}`;
    }
  };

  const updateCartHeader = async (cartId, qty) => {
    if (cartId !== null || cartId === 0) {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/temp_cart_products_id?cartId=${cartId}`
        );
        const data = await response.json();

        updateProductsNr(0);

        const orderItems = data || [];
        const totalProductQty = orderItems.reduce(
          (total, orderItem) => total + parseInt(orderItem.product_qty, 10),
          0
        );

        updateProductsNr(totalProductQty);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addToCart = async (product) => {
    setLoadingAddToCart(true);
    let productExtras = "";

    const variationsString = formatVariations(
      chosenVariations,
      petName,
      shelter
    );
    productExtras = variationsString;

    let tax_rate = 0.23;
    let unit_gross_revenue = parseFloat(product.price).toFixed(2);
    let unit_tax_amount = parseFloat(unit_gross_revenue * tax_rate).toFixed(2);
    let unit_net_revenue = parseFloat(unit_gross_revenue - unit_tax_amount);

    let product_gross_revenue = parseFloat(totalPrice).toFixed(2);
    let tax_amount = parseFloat(product_gross_revenue * tax_rate).toFixed(2);
    let net_revenue = parseFloat(product_gross_revenue - tax_amount).toFixed(2);

    //When cart exists
    if (cartId !== null || cartId === 0) {
      const dataProduct = {
        temp_cart_id: cartId,
        product_id: product.id,
        date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
        product_qty: qty,
        product_net_revenue: net_revenue * qty,
        product_gross_revenue: product_gross_revenue * qty,
        tax_amount: tax_amount * qty,
        unit_gross_revenue: unit_gross_revenue,
        unit_net_revenue: unit_net_revenue,
        unit_tax_amount: unit_tax_amount,
        product_extras: productExtras,
      };

      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/add_to_cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataProduct }),
          }
        );

        const data = await response.json();

        if (data.success) {
          updateCartHeader(cartId, qty);
          setMessage(data.message);
          setStatus("success");
          setIsModalOpen(true);
          setLoadingAddToCart(false);

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (error) {
        setMessage(data.message);
        setStatus("error");
        setIsModalOpen(true);
        setLoadingAddToCart(false);
      }
    } else {
      //when cart doesn't exist
      const storedUserData = localStorage.getItem("user");

      const qty_input = document.querySelector(".ant-input-number-input").value;

      const dataProduct = {
        product_id: product.id,
        date_created: new Date().toISOString().slice(0, 19).replace("T", " "),
        product_qty: qty_input,
        product_net_revenue: net_revenue * qty_input,
        product_gross_revenue: product_gross_revenue * qty_input,
        tax_amount: tax_amount * qty_input,
        unit_gross_revenue: unit_gross_revenue,
        unit_net_revenue: unit_net_revenue,
        unit_tax_amount: unit_tax_amount,
        product_extras: productExtras,
      };

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
        product: dataProduct,
      };

      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/add_to_cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataCart }),
          }
        );

        const data = await response.json();

        if (data.success) {
          updateProductsNr(qty_input);
          setMessage(data.message);
          setStatus("success");
          setIsModalOpen(true);
          setLoadingAddToCart(false);

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          setMessage(data.message);
          setStatus("error");
          setIsModalOpen(true);
          setLoadingAddToCart(false);
        }
      } catch (error) {
        setMessage(data.message);
        setStatus("error");
        setIsModalOpen(true);
        setLoadingAddToCart(false);
      }
    }
  };

  useEffect(() => {
    const storedSessionData = getSessionDataFromLocalStorage(isLoggedIn);
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
    setLoadingButton(true);
    if (rating == 0) setErrorRating("Tem de fornecer uma pontuação.");
    else {
      form
        .validateFields()
        .then(async () => {
          const reviewData = {
            product_id: product.id,
            review: review,
            reviewer:
              reviewerName == "" ? "Anónimo" : reviewerName.target.value,
            reviewer_email: reviewerEmail.target.value,
            rating: rating,
          };

          try {
            const response = await fetch(
              `https://backoffice.petplushies.pt/wp-json/wc/v3/add_review`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ reviewData }),
              }
            );
            const data = await response.json();

            setMessage(data.message);
            setStatus("success");
            setIsModalOpen(true);
            setLoadingButton(false);
          } catch (error) {
            setMessage(data.message);
            setStatus("error");
            setIsModalOpen(true);
            setLoadingButton(false);
          }
        })
        .catch((error) => {
          setMessage("Erro na validação de campos:", error);
          setStatus("error");
          setIsModalOpen(true);
          setLoadingButton(false);
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
          <SEOTags
            title={`${product.name} - Pet Plushies`}
            description={product.desc_short}
            name="PetPlushies"
            type="website"
            image={product.picture}
          />
          <PageHeaderProduct title={product.name} />
          <Container>
            <ModalMessage
              status={status}
              message={message}
              isVisible={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            <ContentLocked>
              <Breadcrumbs page="/loja" item={product.name} />
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
                  <AvgRatingContainer>
                    <div>{avgRating} </div>
                    <StarRatingContainer>
                      {[1, 2, 3, 4, 5].map((index) => (
                        <StyledStarRating
                          key={index}
                          filled={index <= avgRating ? "true" : "false"}
                        />
                      ))}
                    </StarRatingContainer>
                    <div> (de um total de {totalReviews} avaliações.)</div>
                  </AvgRatingContainer>
                  <AddToCart
                    onClick={() => addToCart(product)}
                    loading={loadingAddToCart}
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
                    page="loja"
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
                            loading={loadingButton}
                            disabled={loadingButton}
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
                              <b>{r.name}</b>
                              {" a "}
                              <b>
                                {moment(r.date_created_gmt).format(
                                  "DD [de] MMMM [de] YYYY[, às] HH:mm"
                                )}
                              </b>
                            </div>
                            <StarRatingContainer>
                              {[1, 2, 3, 4, 5].map((index) => (
                                <StyledStarRating
                                  key={index}
                                  filled={
                                    index <= r.rating.rating ? "true" : "false"
                                  }
                                />
                              ))}
                            </StarRatingContainer>
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

const AvgRatingContainer = styled.div`
  display: flex;
  align-items: center;

  & > div {
    line-height: 1;
    margin-right: 5px;
    font-size: 20px;
    &:last-child {
      font-size: 10px;
      margin: 0;
      margin-left: 5px;
    }
  }
`;

const ReviewsContainer = styled(Col)`
  position: relative;
  height: 100%;
  overflow: auto;
  max-height: 520px;
`;

const Review = styled.div`
  border-bottom: 1px solid var(--black);
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
  margin-top: 30px;
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
  background-color: var(--white);
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
  background-color: var(--white);
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
  path: "/loja/:productUrl",
  exact: true,
  component: Product,
};
