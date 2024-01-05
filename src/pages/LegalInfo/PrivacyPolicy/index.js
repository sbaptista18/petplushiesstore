import styled from "styled-components";
import { Row, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

import { PageHeader } from "components";
import { SEOTags } from "fragments";
import { useLoading } from "reducers";
import { useTranslation } from "react-i18next";

import DummyImg from "assets/images/batcat-1.jpg";

const PrivacyPolicy = () => {
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { setLoadingPage } = useLoading();
  const { t } = useTranslation();

  useEffect(() => {
    setLoadingPage(true);
    const fetchPrivacyPolicy = async () => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_privacy_policy`
        );
        const data = await response.json();

        if (data.success) {
          setPost(data.post[0]);
          setLoadingPage(false);
          setLoading(false);
        } else {
          setMessage(data.message);
          setLoadingPage(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setMessage(error);
        setLoadingPage(false);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  console.log(loading);

  return (
    <>
      <SEOTags
        title={`${t("politicaPrivacidade")} - Pet Plushies`}
        description={t("politicaPrivacidadeSEODesc")}
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader
        title={t("politicaPrivacidade")}
        img={DummyImg}
        alt={`${t("politicaPrivacidade")} - Pet Plushies`}
      />
      <Container>
        {loading && !error && (
          <Spinner
            indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          />
        )}
        {error && !loading && <>{message}</>}
        {!loading && post != undefined && (
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
  height: 100%;
  min-height: 300px;
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

  @media screen and (max-width: 992px) {
    margin-bottom: 20px;
  }
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

  & h2 {
    margin-top: 30px;
  }
`;

export default {
  path: "/politica-de-privacidade",
  exact: true,
  component: PrivacyPolicy,
};
