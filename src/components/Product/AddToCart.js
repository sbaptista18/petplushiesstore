import styled from "styled-components";
import PropTypes from "prop-types";
import { Col, Row, Form, InputNumber, Radio, Input } from "antd";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { Button, ModalMessage } from "components";

const { TextArea } = Input;

const AddToCart = ({
  sku,
  price,
  sale_price,
  flag,
  stock,
  onClick,
  loading,
  onDataFromChild,
  variations,
  onUpdateTotalPrice,
  onPetName,
  onShelter,
  onChosenVariations,
}) => {
  const [variationsPrice, setVariationsPrice] = useState([]);
  const [totalVariationsPrice, setTotalVariationsPrice] = useState(0);
  const [qty, setQty] = useState(1);
  const [hasName, setHasName] = useState(false);
  const [form_variations] = Form.useForm();
  const [form_stock] = Form.useForm();
  const [loadingButton, setLoadingButton] = useState(false);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const { t } = useTranslation();

  const onChange = (value) => {
    onDataFromChild(value);
    setQty(value);
  };

  const handlePetName = (e) => {
    onPetName(e.target.value);
  };

  const handleShelter = (e) => {
    onShelter(e.target.value);
  };

  let variationsArray;
  if (variations != null) {
    const updatedData = variations.map((item) => {
      const parts = item.value.split("|");
      const values = parts
        .map((part) => {
          const match = part.match(/(\D+)\((\d+)\)/);
          if (match) {
            const [_, text, value] = match;
            return { name: text.trim(), price: parseInt(value) };
          }
          return null;
        })
        .filter(Boolean);

      return { ...item, values };
    });

    variationsArray = updatedData;
  }

  const handleVariation = (radio, name, price) => {
    if (radio == "Nome") {
      if (name == "Sim") setHasName(true);
      else setHasName(false);
    }
    setVariationsPrice((prevVariations) => {
      const updatedVariations = prevVariations.filter(
        (variation) => variation.radio !== radio
      );

      return [...updatedVariations, { radio, name, price }];
    });
  };

  useEffect(() => {
    if (variationsPrice.length > 0) {
      const totalPrices = variationsPrice.reduce(
        (sum, variation) => sum + variation.price,
        0
      );
      setTotalVariationsPrice(totalPrices);
      onChosenVariations(variationsPrice);
    }
  }, [variationsPrice]);

  useEffect(() => {
    onUpdateTotalPrice(parseFloat(price, 10) + totalVariationsPrice);
  }, [price, totalVariationsPrice]);

  const handleSendEmail = () => {
    setLoadingButton(true);
    form_stock.validateFields().then(async () => {
      const formValues = form_stock.getFieldsValue();
      const dataMessage = {
        email: formValues.email,
        product: sku,
      };

      try {
        const response = await fetch(
          "https://backoffice.petplushies.pt/wp-json/wc/v3/send_notification_email",
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
    });
  };

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function toCamelCase(inputString) {
    const withoutDiacritics = removeDiacritics(inputString);

    return withoutDiacritics
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, "");
  }

  return (
    <Container>
      <ModalMessage
        status={status}
        message={message}
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Sku>REF: {sku}</Sku>
      <PriceContainer>
        <Price flag={flag}>
          {((parseFloat(price, 10) + totalVariationsPrice) * qty).toFixed(2)}
          &euro;
        </Price>
        {flag == "sale" && <Sale>{sale_price}</Sale>}
      </PriceContainer>

      {variationsArray != null && stock != "outofstock" && (
        <Form form={form_variations}>
          {variationsArray?.map((v) => {
            const values = v.values;

            return (
              <FormRow key={v.name}>
                <Form.Item
                  wrapperCol={24}
                  name={v.name}
                  label={t(toCamelCase(v.name))}
                  rules={[
                    {
                      required: true,
                      message: t("seleccionarOpcao"),
                    },
                  ]}
                >
                  <Radio.Group optionType="button" buttonStyle="solid">
                    {values.map((value) => (
                      <Radio.Button
                        onClick={() => {
                          return handleVariation(
                            v.name,
                            value.name,
                            value.price
                          );
                        }}
                        key={value.name}
                        value={value.name}
                      >
                        {t(toCamelCase(value.name))}
                        {value.price != 0 && (
                          <span>
                            {" "}
                            <b>(+{value.price}€)</b>
                          </span>
                        )}
                      </Radio.Button>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </FormRow>
            );
          })}
          {hasName && (
            <FormRow>
              <Form.Item
                wrapperCol={24}
                name="name_pet"
                label={t("nomePet")}
                rules={[
                  {
                    required: true,
                    message: t("escreverNomePet"),
                  },
                ]}
              >
                <Input onChange={handlePetName} />
              </Form.Item>
            </FormRow>
          )}
          <FormRow>
            <Form.Item name="shelter" wrapperCol={24}>
              <>
                <p>
                  {t("associacaoText1")}
                  <br />
                  {t("associacaoText2")}
                  <br />
                  {t("associacaoText3")} <b>{t("associacaoText4")}.</b>
                </p>
                <TextArea
                  onChange={handleShelter}
                  rows={4}
                  placeholder={t("escreverAqui")}
                />
              </>
            </Form.Item>
          </FormRow>
        </Form>
      )}

      {stock == "outofstock" && (
        <>
          <Row>
            <Col span={24}>
              <p>{t("semStockText")}</p>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form form={form_stock} name="stock_notification">
                <Form.Item wrapperCol={24} name="email" label={t("email")}>
                  <Input />
                </Form.Item>
                <Form.Item wrapperCol={24}>
                  <Button
                    size="large"
                    type="primary"
                    text={t("notificar")}
                    onClick={handleSendEmail}
                    loading={loadingButton}
                    disabled={loadingButton}
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </>
      )}

      <InputContainer>
        <StyledInputNumber
          min={1}
          max={10}
          defaultValue={1}
          onChange={onChange}
        />
        <Button
          size="large"
          type="primary"
          text={t("adicionarCarrinho")}
          onClick={onClick}
          loading={loading}
          disabled={stock === "outofstock" || loading}
        />
      </InputContainer>
    </Container>
  );
};

AddToCart.propTypes = {
  sku: PropTypes.string,
  price: PropTypes.number,
  sale_price: PropTypes.string,
  flag: PropTypes.string,
  stock: PropTypes.string,
  onClick: PropTypes.func,
  onDataFromChild: PropTypes.func,
  variations: PropTypes.array,
  onUpdateTotalPrice: PropTypes.func,
  onPetName: PropTypes.func,
  onShelter: PropTypes.func,
  onChosenVariations: PropTypes.func,
  loading: PropTypes.bool,
};

const StyledInputNumber = styled(InputNumber)`
  margin-right: 15px;
`;

const FormRow = styled(Row)`
  justify-content: space-between;
`;

const Container = styled(Col)`
  flex-direction: column;
`;

const Sku = styled.div``;

const PriceContainer = styled.div`
  display: flex;
`;

const Price = styled.div`
  color: ${(props) =>
    props.flag == "sale" ? "var(--dark-gray)" : "var(--black)"};
  text-decoration: ${(props) =>
    props.flag == "sale" ? "line-through" : "none"};
  font-size: 48px;
`;

const Sale = styled(Price)`
  color: var(--black);
  margin-left: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

export default AddToCart;
