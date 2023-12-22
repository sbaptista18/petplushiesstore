import styled from "styled-components";
import { Row } from "antd";

import { PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const ContactUs = () => {
  return (
    <>
      <PageHeader
        title="Contactos"
        img={DummyImg}
        alt="Contactos - Pet Plusies"
      />
      <Container>
        <ContentLocked></ContentLocked>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  background-color: white;
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
  path: "/contactos",
  exact: true,
  component: ContactUs,
};
