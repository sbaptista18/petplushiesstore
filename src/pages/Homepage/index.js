import styled from "styled-components";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Slideshow, TileNoInput, Button, TilePosts } from "components";
import { LazyImage, SEOTags } from "fragments";

import { data } from "./slideshow_data";

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

  useEffect(() => {
    fetchFeaturedProducts();
    fetchBlogPosts();
  }, []);

  const flagText = (stock, status) => {
    if (status == "instock") {
      if (stock == null) return "";
      if (stock > 0) {
        if (stock === 1) return "Apenas 1 em stock!";
        if (stock <= 5) return "Últimas unidades em stock!";
        return "";
      } else return "Esgotado";
    } else {
      return "Esgotado";
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
        title={`Peluches Personalizados - Acessórios - 100% Artesaal - Pet Plushies`}
        description="Procura o presente perfeito para aquele pet lover? Não procure mais! A Pet Plushies tem a mais variada selecção de artigos artesanais para satisfazer até os mais exigentes!"
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <Slideshow
        slides={data}
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
                <StyledH2Center>As nossas sugestões</StyledH2Center>
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
          <Row>
            <Col span={11}>
              <LazyImage src={Img} alt={`Qualquer coisa - Pet Plushies`} />
            </Col>
            <TextContainer span={11}>
              <Row>
                <StyledH2Left>A Pet Plushies</StyledH2Left>
              </Row>
              <VerticalContent>
                <p>
                  Criada em 2021, é uma marca Portuguesa que se foca em realçar
                  o que é importante para qualquer pet lover: artigos de
                  qualidade para eles e os patudos!
                </p>
                <p>
                  Todos os atigos sáo 100% artesanais e sustentáveis para que
                  possamos todos ser amigos do planeta enquanto nos mimamos com
                  o que há de melhor!
                </p>
                <p>
                  A nossa principal missão é levar ajuda a vários
                  abrigos/associações de animais doando 10% de cada compra.
                </p>
                <Link to={"/sobre-nos"}>
                  <Button
                    size="large"
                    type="primary"
                    color="white"
                    text="Ler mais"
                  />
                </Link>
              </VerticalContent>
            </TextContainer>
          </Row>
          <StyledBottomBar />
        </HighlightSection>
        <ContentLocked>
          <div>
            <VerticalContent>
              <Row>
                <StyledH2Center>Últimas novidades!</StyledH2Center>
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

const TextContainer = styled(Col)`
  justify-content: center;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  width: 100%;
`;

const Spinner = styled(Spin)`
  background-color: var(--white);
  width: 100%;
  height: 100%;
  position: relative;
`;

const Content = styled(Row)`
  padding: 0 65px;
  width: 100%;
  flex-direction: column;
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
`;

export default {
  path: "/",
  exact: true,
  component: Homepage,
};
