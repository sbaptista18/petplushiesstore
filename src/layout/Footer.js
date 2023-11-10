import styled from "styled-components";
import { Layout, Menu, Row, Col } from "antd";
import { Link, useHistory } from "react-router-dom";

import Logo from "assets/images/logo.png";

const { Footer } = Layout;

const onClickSectionRegistry = {
  home: (history) => history.push(""),
  "sobre-nos": (history) => history.push("/sobre-nos"),
  produtos: (history) => history.push("/produtos"),
  contactos: (history) => history.push("/contactos"),
  "politica-de-privacidade": (history) =>
    history.push("/politica-de-privacidade"),
  "termos-e-condicoes": (history) => history.push("/termos-e-condicoes"),
  "envios-e-devolucoes": (history) => history.push("/envios-e-devolucoes"),
};

const buildMenuItemProps = (key) => {
  return {
    key,
    label: _.startCase(key),
  };
};

const pages = ["sobre-nos", "produtos", "contactos"];
const legalPages = [
  "politica-de-privacidade",
  "termos-e-condicoes",
  "envios-e-devolucoes",
];

const PPS_Footer = () => {
  const history = useHistory();

  return (
    <StyledFooter>
      <Container>
        <Col span={8}>
          <Link to="/">
            <LogoImg src={Logo} />
          </Link>
        </Col>
        <Col span={8}>
          <StyledH3>Menu</StyledH3>
          <StyledMenu
            mode="vertical"
            items={pages.map(buildMenuItemProps)}
            onClick={({ key }) => {
              onClickSectionRegistry[key](history);
            }}
          />
        </Col>
        <Col span={8}>
          <StyledH3>Contactos</StyledH3>
          <p>
            <a href="mailto:geral@petplushies.pt">geral@petplushies.pt</a>
          </p>
        </Col>
      </Container>
      <SubFooter>
        <LegalMenu
          mode="vertical"
          items={legalPages.map(buildMenuItemProps)}
          onClick={({ key }) => {
            onClickSectionRegistry[key](history);
          }}
        />
        <span>© 2023 Pet Plushies. Todos os direitos reservados.</span>
      </SubFooter>
    </StyledFooter>
  );
};

const StyledFooter = styled(Footer)`
  display: flex;
  flex-direction: column;
  padding: 20px 65px;
  background-color: var(--dark-gray);

  & .ant-menu {
    height: 100%;
    background: transparent;
    border: none;
    font-size: 16px;

    & li {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;

const Container = styled(Row)`
  max-width: 1440px;
  width: 100%;
  margin: auto;
`;

const StyledH3 = styled.h3`
  font-size: 20px;
`;

const StyledMenu = styled(Menu)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  && > li {
    padding: 0;
  }
`;

const LegalMenu = styled(StyledMenu)`
  flex-direction: row;

  && > li {
    padding: 0 16px;
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
`;

export default PPS_Footer;
