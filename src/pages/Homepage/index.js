import styled from "styled-components";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Slideshow, TileNoInput, Button, TilePosts } from "components";
import { LazyImage, SEOTags } from "fragments";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import SlideshowData from "./slideshow_data";

import Img from "assets/images/batcat-1.jpg";
import BottomBar from "assets/images/bottom-bar.svg";

const Homepage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [message, setMessage] = useState("");

  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorPosts, setErrorPosts] = useState(false);
  const [noResultsPosts, setNoResultsPosts] = useState(false);
  const [messagePosts, setMessagePosts] = useState("");
  const slideshowData = SlideshowData();
  const { t } = useTranslation();

  const isMobile = useMediaQuery({ maxWidth: 992 });

  useEffect(() => {
    fetchFeaturedProducts();
    fetchBlogPosts();
  }, []);

  const flagText = (stock, status) => {
    if (status == "instock") {
      if (stock == null) return "";
      if (stock > 0) {
        if (stock === 1) return t("1InStock");
        if (stock <= 5) return t("lastUnits");
        return "";
      } else return t("outOfStock");
    } else {
      return t("outOfStock");
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/wc/v3/get_featured_products"
      );
      const data = await response.json();

      if (data.success) {
        if (data.data === 0) {
          setNoResults(true);
          setMessage(data.message);
        } else {
          const mappedFeaturedProducts = data.data.map((item) => ({
            id: item.id,
            name: item.name,
            price: _.toNumber(item.price),
            stock: item.stock_quantity,
            stock_status: item.stock_status,
            picture: item.main_image_url,
            url: item.slug,
            category: item.categories,
          }));

          setFeaturedProducts(mappedFeaturedProducts);
        }
      } else {
        setNoResults(true);
        setMessage(data.message);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch(
        "https://backoffice.petplushies.pt/wp-json/wc/v3/get_featured_blog_posts"
      );
      const data = await response.json();

      if (data.success) {
        if (data.data.length > 0) {
          setPosts(data.data);
        } else {
          setNoResultsPosts(true);
        }
        setLoadingPosts(false);
      } else {
        setErrorPosts(true);
        setLoadingPosts(false);
        setMessagePosts(data.message);
      }
    } catch (error) {
      setErrorPosts(true);
      setLoadingPosts(false);
      setMessagePosts(data.message);
    }
  };

  return (
    <>
      <SEOTags
        title={`${t("homepageSEOTitle")} - Pet Plushies`}
        description={t("homepageSEODesc")}
        name="PetPlushies"
        type="website"
        image={Img}
      />
      <Slideshow
        slides={slideshowData}
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
      <Container>
        <ContentLocked>
          <div>
            <VerticalContent>
              <Row>
                <StyledH2Center>{t("nossasSugestoes")}</StyledH2Center>
              </Row>
              <FeaturedContainer>
                {loading && !error && (
                  <Spinner
                    indicator={
                      <LoadingOutlined style={{ fontSize: 50 }} spin />
                    }
                  />
                )}
                {error && !loading && !noResults && <>{message}</>}
                {!error && !loading && noResults && <>{message}</>}
                {!error && !loading && !noResults && (
                  <>
                    {featuredProducts.map((p) => (
                      <TileNoInput
                        key={p.id}
                        id={p.id}
                        name={p.name}
                        price={p.price}
                        picture={p.picture}
                        stock={p.stock}
                        flag={flagText(p.stock, p.stock_status)}
                        url={p.url}
                      />
                    ))}
                  </>
                )}
              </FeaturedContainer>
            </VerticalContent>
          </div>
        </ContentLocked>
        <HighlightSection>
          <StyledTopBar />
          <HighlightRow>
            <Col span={isMobile ? 24 : 11}>
              <LazyImage src={Img} alt={`Qualquer coisa - Pet Plushies`} />
            </Col>
            <TextContainer span={isMobile ? 24 : 11}>
              <Row>
                <StyledH2Left>{t("petPlushies")}</StyledH2Left>
              </Row>
              <VerticalContent>
                <p>{t("homepageIntro1")}</p>
                <p>{t("homepageIntro2")}</p>
                <p>{t("homepageIntro3")}</p>
                <Link to={"/sobre-nos"}>
                  <Button
                    size="large"
                    type="primary"
                    color="white"
                    text={t("lerMais")}
                  />
                </Link>
              </VerticalContent>
            </TextContainer>
          </HighlightRow>
          <StyledBottomBar />
        </HighlightSection>
        <ContentLocked>
          <div>
            <VerticalContent>
              <Row>
                <StyledH2Center>{t("ultimasNovidades")}</StyledH2Center>
              </Row>
              <FeaturedContainer>
                {loadingPosts && !errorPosts && (
                  <Spinner
                    indicator={
                      <LoadingOutlined style={{ fontSize: 50 }} spin />
                    }
                  />
                )}
                {errorPosts && !loadingPosts && !noResultsPosts && (
                  <>{messagePosts}</>
                )}
                {!errorPosts && !loadingPosts && noResultsPosts && (
                  <>{messagePosts}</>
                )}
                {!errorPosts &&
                  !loadingPosts &&
                  !noResultsPosts &&
                  posts.map((p) => (
                    <TilePosts
                      key={p.ID}
                      id={p.ID}
                      name={p.post_title}
                      picture={p.post_image_url}
                      url={p.post_name}
                      category={p.categories[0]}
                      excerpt={p.post_excerpt}
                    />
                  ))}
              </FeaturedContainer>
            </VerticalContent>
          </div>
        </ContentLocked>
      </Container>
    </>
  );
};

const HighlightRow = styled(Row)`
  @media screen and (max-width: 992px) {
    flex-direction: column;
  }
`;

const TextContainer = styled(Col)`
  justify-content: center;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 992px) {
    margin-top: 20px;
  }
`;

const Container = styled.div`
  width: 100%;
  position: relative;
`;

const Spinner = styled(Spin)`
  background-color: var(--white);
  width: 100%;
  height: 500px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 992px) {
    height: 100px;
  }
`;

const Content = styled(Row)`
  padding: 0 65px;
  width: 100%;
  flex-direction: column;

  @media screen and (max-width: 992px) {
    padding: 25px;
  }
`;

const ContentLocked = styled(Content)`
  width: 100%;
  background-color: var(--white);
  position: relative;

  & > div {
    max-width: 1440px;
    width: 100%;
    margin: auto;
  }
`;

const HighlightSection = styled(Content)`
  height: auto;
  background-color: var(--light-blue);
  padding-top: 100px;
  padding-bottom: 100px;
  position: relative;

  & > div {
    max-width: 1440px;
    width: 100%;
    margin: auto;
    justify-content: space-between;
  }
`;

const StyledBottomBar = styled(BottomBar)`
  position: absolute;
  bottom: -1px;
  left: 0;
  fill: #fff;
`;

const StyledTopBar = styled(StyledBottomBar)`
  top: -1px;
  transform: rotate(180deg);
`;

const StyledH2Center = styled.h2`
  align-self: center;
  width: 100%;
  text-align: center;
  font-weight: 600;
`;

const StyledH2Left = styled(StyledH2Center)`
  align-self: flex-start;
  text-align: left;
`;

const VerticalContent = styled(Row)`
  padding: 30px 0;
  display: flex;
  flex-direction: column;
`;

const FeaturedContainer = styled(Row)`
  min-height: 500px;
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;

  @media screen and (max-width: 992px) {
    flex-direction: column;
    min-height: 100px;
  }
`;

export default {
  path: "/",
  exact: true,
  component: Homepage,
};
