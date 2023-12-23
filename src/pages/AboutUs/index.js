import styled from "styled-components";
import { Row, Col } from "antd";

import { PageHeader } from "components";
import { LazyImage } from "fragments";

import DummyImg from "assets/images/batcat-1.jpg";
import BottomBar from "assets/images/bottom-bar.svg";

import Charity from "assets/images/about-us/charity.png";
import Needle from "assets/images/about-us/needle.png";
import Portugal from "assets/images/about-us/portugal.png";
import Recycling from "assets/images/about-us/recycling.png";

const AboutUs = () => {
  return (
    <>
      <PageHeader
        title="Sobre Nós"
        img={DummyImg}
        alt="Sobre Nós - Pet Plusies"
      />
      <Container>
        <ContentLocked>
          <VerticalContent span={24}>
            <StyledH2>Como tudo começou...</StyledH2>
            <SpaceBetween>
              <TextContainer span={11}>
                <p>
                  A inspiração veio da adopção da gata Ysera, que está connosco
                  desde Junho de 2020.
                  <br />
                  Ao ver as condições do abrigo onde a fomos buscar algo deu um
                  clique e comecei a tentar entender como poderia ajudar mais
                  para além das doações habituais.
                </p>
                <p>
                  Depois de algum pleaneamento e pesquisa, decidimos então
                  envergar pelos peluches e acessórios para pets. Percebemos que
                  havia uma lacuna no mercado em relação a peluches
                  personalizados ao detalhe e assim surgiu a Pet Plushies!
                </p>
                <p>
                  Sustentabilidade é também uma preocupação nossa pelo que os
                  nossos artigos são feitos com o máximo de artigos recliclávais
                  possível e as nossas embalagens contém o mínimo de plástico
                  possível.
                </p>
                <p>Pet Plushies: o teu melhor amigo. Na palma da tua mão!</p>
              </TextContainer>
              <Col span={11}>
                <LazyImage src={DummyImg} alt={"Foto da gata Ysera"} />
              </Col>
            </SpaceBetween>
          </VerticalContent>
        </ContentLocked>
        <HighlightSection>
          <StyledTopBar />
          <Row>
            <Cell span={11}>
              <Icon>
                <img
                  src={Portugal}
                  alt="Ícone da bandeira de Portugal - Pet Plushies"
                />
              </Icon>
              <Title>100% Portuguesa</Title>
              <Text>
                A Pet Plusies é uma marca 100% Portuguesa registada no INPI.
                Preocupamo-nos sempre em utilizar materiais portugueses sempre
                que possível.
              </Text>
            </Cell>
            <Cell span={11}>
              <Icon>
                <img
                  src={Needle}
                  alt="Ícone de agulha e carrinho de linha - Pet Plushies"
                />
              </Icon>
              <Title>100% Artesanal</Title>
              <Text>
                Todos os nossos produtos são feitos à mão e com todo o carinho.
                Por essa mesma razão não fazemos Black Friday ou fazemos saldos.
                Os artesãos são assim pagos justamente e com dignidade.
              </Text>
            </Cell>
          </Row>
          <Row>
            <Cell span={11}>
              <Icon>
                <img src={Charity} alt="Ícone de caridade - Pet Plushies" />
              </Icon>
              <Title>Ajudamos associações/abrigos de animais</Title>
              <Text>
                10% de todas as compras serão doados ao abrigo/associação do
                mês, ou então àquele que preferir no caso dos produtos
                personalizados.
              </Text>
            </Cell>
            <Cell span={11}>
              <Icon>
                <img src={Recycling} alt="Ícone de reciclagem - Pet Plushies" />
              </Icon>
              <Title>Sustentável</Title>
              <Text>
                Tentamos com que os materiais que usamos sejam o mais
                sustentáveis possível se assim for possível. Trabalhamos com
                materiais reciclados e recicláveis e as nossas encomendas
                incluem o mínimo possível de plásticos e seus derivados.
              </Text>
            </Cell>
          </Row>
          <StyledBottomBar />
        </HighlightSection>
      </Container>
    </>
  );
};

const Cell = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
`;

const Icon = styled.div`
  & img {
    width: 100px;
    height: auto;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-top: 20px;
`;

const Text = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Content = styled(Row)`
  padding: 0 65px;
  width: 100%;
  flex-direction: column;
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

const StyledH2 = styled.h2`
  font-weight: 600;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
`;

const TextContainer = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
`;

const VerticalContent = styled(Col)`
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const SpaceBetween = styled(Row)`
  display: flex;
  justify-content: space-between;
`;

export default {
  path: "/sobre-nos",
  exact: true,
  component: AboutUs,
};
