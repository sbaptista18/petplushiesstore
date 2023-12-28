import styled from "styled-components";
import { Row } from "antd";
import { useState, useEffect } from "react";

import { PageHeader } from "components";

import DummyImg from "assets/images/batcat-1.jpg";

const ContactUs = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetcCountries = async () => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_selling_countries`
        );
        const data = await response.json();

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetcCountries();
  }, []);

  return (
    <>
      <PageHeader
        title="Contactos"
        img={DummyImg}
        alt="Contactos - Pet Plushies"
      />
      <Container>
        <ContentLocked></ContentLocked>
      </Container>
    </>
  );
};

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
  path: "/contactos",
  exact: true,
  component: ContactUs,
};
