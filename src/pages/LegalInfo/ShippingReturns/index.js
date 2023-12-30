import styled from "styled-components";
import { Row, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

import { PageHeader } from "components";
import { SEOTags } from "fragments";
import { useLoading } from "reducers";

import DummyImg from "assets/images/batcat-1.jpg";

const ShippingReturns = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { setLoadingPage } = useLoading();

  useEffect(() => {
    setLoadingPage(true);
    const fetchShippingReturns = async () => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_shipping_returns`
        );
        const data = await response.json();

        if (data.success) {
          setPost(data.post[0]);
          setLoading(false);
          setLoadingPage(false);
        } else {
          setLoading(false);
          setLoadingPage(false);
          setMessage(data.message);
        }
      } catch (error) {
        setError(true);
        setMessage(error);
      }
    };

    fetchShippingReturns();
  }, []);

  return (
    <>
      <SEOTags
        title={`Envios e Devoluções - Pet Plushies`}
        description="Toda a informação sobre a política de Envios e Devoluções da Pet Plushies."
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader
        title="Envios e Devoluções"
        img={DummyImg}
        alt="Envios e Devoluções - Pet Plushies"
      />
      <Container>
        {loading && !error && (
          <Spinner
            indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          />
        )}
        {error && !loading && <>{message}</>}
        {post != undefined && (
          <ContentLocked
            dangerouslySetInnerHTML={{ __html: post.post_content }}
          />
        )}
      </Container>
    </>
  );
};

const Spinner = styled(Spin)`
  position: absolute;
  background-color: var(--white);
  width: 100%;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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
  min-height: 500px;
  padding-top: 30px;

  & h2 {
    margin-top: 30px;
  }
`;

export default {
  path: "/envios-e-devolucoes",
  exact: true,
  component: ShippingReturns,
};
