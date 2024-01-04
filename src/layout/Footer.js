import styled from "styled-components";
import { Layout, Menu, Row, Col } from "antd";
import { Link, useHistory } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import Logo from "assets/images/logo.png";
import BottomBar from "assets/images/bottom-bar.svg";
import FacebookIcon from "assets/images/fb-icon.svg";
import InstagramIcon from "assets/images/ig-icon.svg";
import TiktokIcon from "assets/images/tt-icon.svg";

import {
  MainMenuItems,
  SecondaryMenuItems,
  LegalMenuItems,
} from "../data/menuItems";

const { Footer } = Layout;
import { useTranslation } from "react-i18next";

const onClickSectionRegistry = {
  home: (history) => history.push(""),
  "sobre-nos": (history) => history.push("/sobre-nos"),
  loja: (history) => history.push("/loja"),
  blog: (history) => history.push("/blog"),
  contactos: (history) => history.push("/contactos"),
  "politica-de-privacidade": (history) =>
    history.push("/politica-de-privacidade"),
  "termos-e-condicoes": (history) => history.push("/termos-e-condicoes"),
  "envios-e-devolucoes": (history) => history.push("/envios-e-devolucoes"),
  "perguntas-frequentes": (history) => history.push("/perguntas-frequentes"),
  "seguir-encomenda": (history) => history.push("/seguir-encomenda"),
};

const buildMenuItemProps = (item) => {
  return {
    key: item.path,
    label: item.label,
  };
};

const PPS_Footer = () => {
  const history = useHistory();

  const mainMenuItems = MainMenuItems();
  const secondaryMenuItems = SecondaryMenuItems();
  const legalMenuItems = LegalMenuItems();
  const { t } = useTranslation();

  const isMobile = useMediaQuery({ maxWidth: 992 });

  return (
    <StyledFooter>
      <StyledTopBar />
      <Container>
        <Col span={isMobile ? 24 : 6}>
          <Link to="/" name="Pet Plushies">
            <LogoImg src={Logo} alt="Logo da Pet Plushies" />
          </Link>
        </Col>
        <Col span={isMobile ? 12 : 6}>
          <StyledH3>Menu</StyledH3>
          <StyledMenu
            mode="vertical"
            items={mainMenuItems.map(buildMenuItemProps)}
            onClick={({ key }) => {
              onClickSectionRegistry[key](history);
            }}
          />
        </Col>
        <Col span={isMobile ? 12 : 6}>
          <StyledH3>{t("contactos")}</StyledH3>
          <p>
            <a href="mailto:geral@petplushies.pt">geral@petplushies.pt</a>
          </p>
          <StyledH3>{t("linksUteis")}</StyledH3>
          <StyledMenu
            mode="vertical"
            items={secondaryMenuItems.map(buildMenuItemProps)}
            onClick={({ key }) => {
              onClickSectionRegistry[key](history);
            }}
          />
        </Col>
        <Col span={isMobile ? 24 : 6}>
          <StyledH3>{t("sigaRedes")}</StyledH3>
          <p>
            <SocialLink
              name="Link para página do Facebook da Pet Plushies"
              href="https://www.facebook.com/petplushiesshop"
              target="_blank"
            >
              <FacebookIcon />
            </SocialLink>
            <SocialLink
              name="Link para página do Instagram da Pet Plushies"
              href="https://www.instagram.com/petplushiesstore"
              target="_blank"
            >
              <InstagramIcon />
            </SocialLink>
            <SocialLink
              name="Link para página do TikTok da Pet Plushies"
              href="https://www.tiktok.com/@petplushiesstore"
              target="_blank"
            >
              <TiktokIcon />
            </SocialLink>
          </p>
        </Col>
      </Container>
      <SubFooter>
        <LegalMenu
          mode="vertical"
          items={legalMenuItems.map(buildMenuItemProps)}
          onClick={({ key }) => {
            onClickSectionRegistry[key](history);
          }}
        />
        <span>
          © {new Date().getFullYear()} Pet Plushies. {t("direitosReservados")}.
        </span>
      </SubFooter>
    </StyledFooter>
  );
};

const SocialLink = styled.a`
  margin-right: 10px;
  & > svg {
    fill: #fff;
    width: 30px;
    height: auto;
    transition: 0.5s;

    &:hover {
      fill: var(--light-blue);
    }
  }
`;

const StyledTopBar = styled(BottomBar)`
  position: absolute;
  left: 0;
  fill: #fff;
  top: -1px;
  transform: rotate(180deg);
`;

const StyledFooter = styled(Footer)`
  display: flex;
  flex-direction: column;
  padding: 20px 65px;
  padding-top: 100px;
  background-color: var(--dark-gray);
  position: relative;
  color: var(--white);

  @media screen and (max-width: 992px) {
    padding: 25px;
  }

  & a {
    color: var(--white);
    transition: 0.5s;

    &:hover {
      color: var(--light-blue);
    }
  }

  & .ant-menu {
    background: transparent;
    border: none;
    font-size: 16px;

    & li {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    & .ant-menu-item {
      background: transparent;
      height: auto;
      line-height: 1.2;
    }
  }
`;

const Container = styled(Row)`
  max-width: 1440px;
  width: 100%;
  margin: auto;

  @media screen and (max-width: 992px) {
    flex-direction: row;
    flex-wrap: wrap;

    & > div {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      &:first-child,
      &:last-child {
        align-items: center;
      }
    }
  }
`;

const StyledH3 = styled.h3`
  font-size: 20px;
  color: var(--white);
  font-weight: 600;
`;

const StyledMenu = styled(Menu)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  && > li {
    padding: 0;
    color: var(--white);

    &:hover {
      color: var(--light-blue);
    }
  }
`;

const LegalMenu = styled(StyledMenu)`
  flex-direction: row;

  @media screen and (max-width: 992px) {
    flex-direction: column;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  && > li {
    padding: 0 16px;
    color: var(--white);

    @media screen and (max-width: 992px) {
      text-align: center;
    }

    &:hover {
      color: var(--light-blue);
    }
  }

  &:not(.ant-menu-horizontal) {
    & .ant-menu-item-selected,
    & .ant-menu-item-active {
      background-color: transparent;
    }
  }
`;

const SubFooter = styled(Container)`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
`;

const LogoImg = styled.img`
  width: 200px;
  height: auto;

  @media screen and (max-width: 992px) {
    margin: 20px 0;
  }
`;

export default PPS_Footer;
