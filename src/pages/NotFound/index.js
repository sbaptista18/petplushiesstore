import styled from "styled-components";
import { Row } from "antd";
import { useHistory } from "react-router-dom";
import { SEOTags } from "fragments";
import { useTranslation } from "react-i18next";
import { Button, PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const NotFound = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const handleBack = () => {
    history.goBack();
  };

  return (
    <>
      <SEOTags
        title={`404 - ${t("naoEncontrado")} - Pet Plushies`}
        description=""
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader
        title="Oops :("
        img={DummyImg}
        alt={`404 - ${t("naoEncontrado")} - Pet Plushies`}
      />
      <Container>
        <ContentLocked>
          {t("naoEncontradoMsg")}
          <StyledButton
            size="large"
            text={t("voltarPaginaAnterior")}
            type="primary"
            htmlType="submit"
            onClick={() => handleBack()}
          />
        </ContentLocked>
      </Container>
    </>
  );
};

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
  margin-top: 20px;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
  position: relative;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default NotFound;
