import { Collapse } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

const Accordion = ({ desc }) => {
  const { t } = useTranslation();
  const items = [
    {
      key: "1",
      label: t("infoProduto"),
      children: desc,
    },
    {
      key: "2",
      label: t("politicaRetorno"),
      children: `<p>
          ${t(
            "politicaRetornoText1"
          )} <a href='/termos-e-condicoes' target='_blank'>${t(
        "termosCondicoes"
      )}</a> ${t(
        "politicaRetornoText2"
      )} <a href='/envios-e-devolucoes' target='_blank'>${t(
        "enviosDevolucoes"
      )}</a>.
        </p>`,
    },
    {
      key: "3",
      label: t("infoEnvio"),
      children: `<p>
      ${t("infoEnvioText")} <a href='/termos-e-condicoes' target='_blank'>${t(
        "termosCondicoes"
      )}</a>.
        </p>`,
    },
    {
      key: "4",
      label: t("ajudarAbrigos"),
      children: `<p>
      ${t("ajudarAbrigosText1")}
          <br>
          <b>${t(
            "ajudarAbrigosText2"
          )} <a href='/blog' target='_blank'>Blog</a>.</b>
        </p>`,
    },
  ];
  return (
    <Container defaultActiveKey={["1"]} accordion>
      {items.map((item) => (
        <Panel header={item.label} key={item.key}>
          <div dangerouslySetInnerHTML={{ __html: item.children }} />
        </Panel>
      ))}
    </Container>
  );
};

Accordion.propTypes = {
  desc: PropTypes.string,
};

const Container = styled(Collapse)`
  margin-top: 30px;

  & img {
    @media screen and (max-width: 992px) {
      width: 100%;
      height: auto;
    }
  }
`;

export default Accordion;
