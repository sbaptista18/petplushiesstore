import styled from "styled-components";
import { Row, Collapse } from "antd";

import { PageHeader } from "components";
import { SEOTags } from "fragments";
import { useTranslation } from "react-i18next";

import DummyImg from "assets/images/batcat-1.jpg";

const { Panel } = Collapse;

const FAQ = () => {
  const { t } = useTranslation();

  const items = [
    {
      key: "1",
      label: t("FAQ1_1"),
      children: `<p>${t("FAQ1_2")}</p>`,
    },
    {
      key: "2",
      label: t("FAQ2_1"),
      children: `<p>${t("FAQ2_2")}</p>`,
    },
    {
      key: "3",
      label: t("FAQ3_1"),
      children: `<p>${t("FAQ3_2")}</p>`,
    },
    {
      key: "4",
      label: t("FAQ4_1"),
      children: `<p>${t("FAQ4_2")}</p>`,
    },
    {
      key: "5",
      label: t("FAQ5_1"),
      children: `<p>${t("FAQ5_2")}</p>`,
    },
    {
      key: "6",
      label: t("FAQ6_1"),
      children: `<p>${t("FAQ6_2")}</p>`,
    },
    {
      key: "7",
      label: t("FAQ7_1"),
      children: `<p>${t("FAQ7_2")}</p>`,
    },
  ];
  return (
    <>
      <SEOTags
        title={`${t("perguntasFrequentes")} - Pet Plushies`}
        description={t("perguntasFrequentesSEODesc")}
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader
        title={t("perguntasFrequentes")}
        img={DummyImg}
        alt={`${t("perguntasFrequentes")} - Pet Plushies`}
      />
      <Container>
        <ContentLocked>
          <Accordion defaultActiveKey={["1"]} accordion>
            {items.map((item) => (
              <Panel header={item.label} key={item.key}>
                <div dangerouslySetInnerHTML={{ __html: item.children }} />
              </Panel>
            ))}
          </Accordion>
        </ContentLocked>
      </Container>
    </>
  );
};

const Accordion = styled(Collapse)`
  margin-top: 30px;
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
  min-height: 500px;
`;

export default {
  path: "/perguntas-frequentes",
  exact: true,
  component: FAQ,
};
