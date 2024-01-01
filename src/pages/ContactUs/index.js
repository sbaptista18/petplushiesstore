import styled from "styled-components";
import { Row, Col, Form, Input, Checkbox } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

import { Button, ModalMessage, PageHeader } from "components";
import { SEOTags } from "fragments";
import { useTranslation } from "react-i18next";

import DummyImg from "assets/images/batcat-1.jpg";
import FacebookIcon from "assets/images/fb-icon.svg";
import InstagramIcon from "assets/images/ig-icon.svg";
import TiktokIcon from "assets/images/tt-icon.svg";

const { TextArea } = Input;

const ContactUs = () => {
  const [message, setMessage] = useState("");
  const [form] = Form.useForm();
  const [isVerified, setIsVerified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [loadingButton, setLoadingButton] = useState(false);

  const [textAreaValue, setTextAreaValue] = useState("");
  const { t } = useTranslation();

  const handleTextAreaChange = (e) => {
    setTextAreaValue(e.target.value);
  };

  const handleSubmit = () => {
    setLoadingButton(true);
    form.validateFields().then(async () => {
      if (textAreaValue.trim() === "") {
        setMessage(t("preencherCampoMsg"));
        setStatus("error");
        setIsModalOpen(true);
        setLoadingButton(false);
      } else {
        const formValues = form.getFieldsValue();
        const dataMessage = {
          email: formValues.email,
          name: formValues.first_name,
          surname: formValues.surname,
          subject: formValues.subject,
          message: textAreaValue,
        };

        try {
          const response = await fetch(
            "https://backoffice.petplushies.pt/wp-json/wc/v3/send_email",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ dataMessage }),
            }
          );
          const data = await response.json();

          if (data.success) {
            setMessage(data.message);
            setStatus("success");
            setIsModalOpen(true);
            setLoadingButton(false);
          } else {
            setMessage(data.message);
            setStatus("error");
            setIsModalOpen(true);
            setLoadingButton(false);
          }
        } catch (error) {
          setMessage(data.message);
          setStatus("error");
          setIsModalOpen(true);
          setLoadingButton(false);
        }
      }
    });
  };

  const handleVerification = (value) => {
    setIsVerified(value);
  };

  return (
    <>
      <SEOTags
        title={`${t("contactos")} - Pet Plushies`}
        description={t("contactosSEODesc")}
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader
        title={t("contactos")}
        img={DummyImg}
        alt={`${t("contactos")} - Pet Plushies`}
      />
      <Container>
        <ModalMessage
          status={status}
          message={message}
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <ContentLocked>
          <TextContainer span={11}>
            <p>{t("contactosP1")}</p>
            <p>{t("contactosP2")}</p>
            <p>{t("contactosP3")}</p>
            <p>{t("contactosP4")}</p>
            <br />
            <p>{t("contactosP4")}</p>
            <p>
              <SocialLink
                href="https://www.facebook.com/petplushiesshop"
                target="_blank"
              >
                <FacebookIcon />
              </SocialLink>
              <SocialLink
                href="https://www.instagram.com/petplushiesstore"
                target="_blank"
              >
                <InstagramIcon />
              </SocialLink>
              <SocialLink
                href="https://www.tiktok.com/@petplushiesstore"
                target="_blank"
              >
                <TiktokIcon />
              </SocialLink>
            </p>
          </TextContainer>
          <Col span={11}>
            <Form
              layout="vertical"
              form={form}
              name="checkout"
              style={{
                maxWidth: 600,
              }}
              scrollToFirstError
            >
              <FormRow>
                <Col span={11}>
                  <Form.Item
                    wrapperCol={24}
                    name="first_name"
                    label={t("nome")}
                    rules={[
                      {
                        required: true,
                        message: t("inserirNome"),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    wrapperCol={24}
                    name="surname"
                    label={t("apelido")}
                    rules={[
                      {
                        required: true,
                        message: t("inserirApelido"),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </FormRow>
              <FormRow>
                <Col span={11}>
                  <Form.Item
                    wrapperCol={24}
                    name="subject"
                    label={t("assunto")}
                    rules={[
                      {
                        required: true,
                        message: t("inserirAsssunto"),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item
                    name="email"
                    label={t("email")}
                    rules={[
                      {
                        type: "email",
                        message: t("emailInvalido"),
                      },
                      {
                        required: true,
                        message: t("inserirEmail"),
                      },
                    ]}
                    wrapperCol={24}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </FormRow>
              <FormRow>
                <Col span={24}>
                  <Form.Item
                    name="message"
                    wrapperCol={24}
                    value={textAreaValue}
                    onChange={handleTextAreaChange}
                  >
                    <>
                      <span>{t("mensagem")}</span>
                      <TextArea
                        rows={4}
                        placeholder={t("escrevaAquiMensagem")}
                      />
                    </>
                  </Form.Item>
                </Col>
              </FormRow>
              <FormRow>
                <Col span={24}>
                  <Form.Item
                    wrapperCol={24}
                    label="Captcha"
                    extra={t("captchaHumano")}
                  >
                    <ReCAPTCHA
                      // sitekey="6LeeeyEpAAAAAHEmtDr81K8xOhEkbCcM32FGYqtF" //localhost
                      sitekey="6LcGYz8pAAAAAKL8E_B9V_DkFqIXiApSnLnfE4Z0" //production
                      onChange={handleVerification}
                    />
                  </Form.Item>
                </Col>
              </FormRow>
              <FormRow>
                <Form.Item
                  name="accept_terms"
                  valuePropName="checked"
                  wrapperCol={24}
                  rules={[
                    {
                      required: true,
                      message: t("confirmarTermos"),
                    },
                  ]}
                >
                  <Checkbox>
                    {t("declararTC")}{" "}
                    <Link to="/termos-e-condicoes" target="_blank">
                      {t("termosCondicoes")}
                    </Link>
                  </Checkbox>
                </Form.Item>
              </FormRow>
              <FormRow>
                <Col span={24}>
                  <Form.Item wrapperCol={24}>
                    <StyledButton
                      size="large"
                      text={t("enviarMsg")}
                      type="primary"
                      htmlType="submit"
                      loading={loadingButton}
                      onClick={handleSubmit}
                      disabled={!isVerified || loadingButton}
                    />
                  </Form.Item>
                </Col>
              </FormRow>
            </Form>
          </Col>
        </ContentLocked>
      </Container>
    </>
  );
};

const TextContainer = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const SocialLink = styled.a`
  margin-right: 10px;
  & > svg {
    fill: var(--light-blue);
    width: 30px;
    height: auto;
    transition: 0.5s;

    &:hover {
      fill: var(--dark-gray);
    }
  }
`;

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

const FormRow = styled(Row)`
  justify-content: space-between;
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
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`;

export default {
  path: "/contactos",
  exact: true,
  component: ContactUs,
};
