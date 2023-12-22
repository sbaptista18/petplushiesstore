import styled from "styled-components";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Slideshow, TileNoInput, Button } from "components";
import { LazyImage } from "fragments";

import { data } from "./slideshow_data";

import Img from "assets/images/batcat-1.jpg";
import BottomBar from "assets/images/bottom-bar.svg";

const Homepage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noResults, setNoResults] = useState(false);

  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
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
      const options = {
        method: "GET",
        url: "/products",
      };

      const response = await axios.request(options);
      const data = response.data;

      if (data.length === 0) {
        setNoResults(true);
      } else {
        const featured_products = data.filter(
          (product) => product.featured === true
        );

        const mappedFeaturedProducts = featured_products.map((item) => ({
          id: item.id,
          name: item.name,
          price: _.toNumber(item.price),
          stock: item.stock_quantity,
          stock_status: item.stock_status,
          picture: item.images[0].src,
          url: item.slug,
          category: item.categories[0].slug,
        }));

        setFeaturedProducts(mappedFeaturedProducts);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
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
      <ContentLocked>
        <div>
          <VerticalContent>
            <Row>
              <StyledH2Center>As nossas sugestões</StyledH2Center>
            </Row>
            <FeaturedProductsContainer>
              {loading && !error && (
                <Spinner
                  indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
                />
              )}
              {error && !loading && !noResults && (
                <>Erro ao carregar a lista de produtos.</>
              )}
              {!error && !loading && noResults && (
                <>Não há resultados para o filtro seleccionado.</>
              )}
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
            </FeaturedProductsContainer>
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
                Criada em 2021, é uma marca Portuguesa que se foca em realçar o
                que é importante para qualquer pet lover: artigos de qualidade
                para eles e os patudos!
              </p>
              <p>
                Todos os atigos sáo 100% artesanais e sustentáveis para que
                possamos todos ser amigos do planeta enquanto nos mimamos com o
                que há de melhor!
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
              <StyledH2Center>Últimas notícias</StyledH2Center>
            </Row>
            <Row>Últimos posts do blog</Row>
          </VerticalContent>
        </div>
      </ContentLocked>
    </Container>
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
  background-color: white;

  & > div {
    max-width: 1440px;
    width: 100%;
    margin: auto;
  }
`;

const HighlightSection = styled(Content)`
  height: auto;
  background-color: lightblue;
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

const FeaturedProductsContainer = styled(Row)`
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
