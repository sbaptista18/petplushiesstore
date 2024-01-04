import styled from "styled-components";
import { Row, Col } from "antd";

import { PageHeader } from "components";
import { LazyImage, SEOTags } from "fragments";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";

import DummyImg from "assets/images/batcat-1.jpg";
import BottomBar from "assets/images/bottom-bar.svg";

import Charity from "assets/images/about-us/charity.png";
import Needle from "assets/images/about-us/needle.png";
import Portugal from "assets/images/about-us/portugal.png";
import Recycling from "assets/images/about-us/recycling.png";

const AboutUs = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery({ maxWidth: 992 });
  return (
    <>
      <SEOTags
        title={`${t("sobreNos")} - Pet Plushies`}
        description={t("sobreNos")}
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader
        title={t("sobreNos")}
        img={DummyImg}
        alt={`${t("sobreNos")} - Pet Plushies`}
      />
      <Container>
        <ContentLocked>
          <VerticalContent span={24}>
            <StyledH2>{t("sobreNosTitulo")}</StyledH2>
            <SpaceBetween>
              <TextContainer span={isMobile ? 24 : 11}>
                <p>
                  {t("sobreNosPageP1_1")}
                  <br />
                  {t("sobreNosPageP1_2")}
                </p>
                <p>{t("sobreNosPageP2")}</p>
                <p>{t("sobreNosPageP3")}</p>
                <p>{t("sobreNosPageP4")}</p>
              </TextContainer>
              <Col span={isMobile ? 24 : 11}>
                <LazyImage src={DummyImg} alt={"Foto da gata Ysera"} />
              </Col>
            </SpaceBetween>
          </VerticalContent>
        </ContentLocked>
        <HighlightSection>
          <StyledTopBar />
          <Row>
            <Cell span={isMobile ? 24 : 11}>
              <Icon>
                <img
                  src={Portugal}
                  alt="Ícone da bandeira de Portugal - Pet Plushies"
                />
              </Icon>
              <Title>{t("100PT")}</Title>
              <Text>{t("100PT_P")}</Text>
            </Cell>
            <Cell span={isMobile ? 24 : 11}>
              <Icon>
                <img
                  src={Needle}
                  alt="Ícone de agulha e carrinho de linha - Pet Plushies"
                />
              </Icon>
              <Title>{t("100Artesanal")}</Title>
              <Text>{t("100Artesanal_P")}</Text>
            </Cell>
          </Row>
          <Row>
            <Cell span={isMobile ? 24 : 11}>
              <Icon>
                <img src={Charity} alt="Ícone de caridade - Pet Plushies" />
              </Icon>
              <Title>{t("ajudarAbrigos")}</Title>
              <Text>{t("ajudarAbrigos_P")}</Text>
            </Cell>
            <Cell span={isMobile ? 24 : 11}>
              <Icon>
                <img src={Recycling} alt="Ícone de reciclagem - Pet Plushies" />
              </Icon>
              <Title>{t("sustentavel")}</Title>
              <Text>{t("sustentavel_P")}</Text>
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

  @media screen and (max-width: 992px) {
    text-align: center;
  }
`;

const Text = styled.div`
  margin-top: 20px;
  text-align: center;
`;

const Content = styled(Row)`
  padding: 0 65px;
  width: 100%;
  flex-direction: column;

  @media screen and (max-width: 992px) {
    padding: 25px;
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

const HighlightSection = styled(Content)`
  height: auto;
  background-color: var(--light-blue);
  padding-top: 100px;
  padding-bottom: 100px;
  position: relative;

  @media screen and (max-width: 992px) {
    flex-direction: column;
  }

  & > div {
    max-width: 1440px;
    width: 100%;
    margin: auto;
    justify-content: space-between;

    @media screen and (max-width: 992px) {
      flex-direction: column;
    }
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

  @media screen and (max-width: 992px) {
    margin-top: 20px;
  }
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

  @media screen and (max-width: 992px) {
    flex-direction: column-reverse;
  }
`;

export default {
  path: "/sobre-nos",
  exact: true,
  component: AboutUs,
};
