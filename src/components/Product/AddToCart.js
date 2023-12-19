import styled from "styled-components";
import PropTypes from "prop-types";
import { Col, Row, Form, InputNumber, Radio } from "antd";
import { useState, useEffect } from "react";

import { Button } from "components";

const AddToCart = ({
  sku,
  price,
  sale_price,
  flag,
  stock,
  onClick,
  onDataFromChild,
  variations,
  onUpdateTotalPrice,
}) => {
  const [variationsPrice, setVariationsPrice] = useState([]);
  const [totalVariationsPrice, setTotalVariationsPrice] = useState(0);
  const [qty, setQty] = useState(1);

  const onChange = (value) => {
    onDataFromChild(value);
    setQty(value);
  };

  let variationsArray;
  if (variations != null) {
    let variationsArrayAux = Object.keys(variations).map(
      (key) => variations[key]
    );

    const updatedData = variationsArrayAux.map((item) => {
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
    setVariationsPrice((prevVariations) => {
      const updatedVariations = prevVariations.filter(
        (variation) => !(variation.radio === radio)
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
    }
  }, [variationsPrice]);

  useEffect(() => {
    onUpdateTotalPrice(parseFloat(price, 10) + totalVariationsPrice);
  }, [price, totalVariationsPrice]);

  return (
    <Container>
      <Sku>REF: {sku}</Sku>
      <PriceContainer>
        <Price flag={flag}>
          {(parseFloat(price, 10) + totalVariationsPrice) * qty + "€"}
        </Price>
        {flag == "sale" && <Sale>{sale_price}</Sale>}
      </PriceContainer>

      {variationsArray != null && (
        <Form>
          {variationsArray?.map((v) => {
            const values = v.values;

            return (
              <FormRow key={v.name}>
                <Form.Item
                  wrapperCol={24}
                  name={v.name}
                  label={v.name}
                  rules={[
                    {
                      required: true,
                      message: "Tem de seleccionar uma opção.",
                    },
                  ]}
                >
                  <Radio.Group optionType="button" buttonStyle="solid">
                    {values.map((value) => (
                      <Radio.Button
                        onClick={() =>
                          handleVariation(v.name, value.name, value.price)
                        }
                        key={value.name}
                        value={value.name}
                      >
                        {value.name}
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
        </Form>
      )}

      <InputContainer>
        <InputNumber min={1} max={10} defaultValue={1} onChange={onChange} />
        <StyledButton
          size="large"
          type="primary"
          text="Adicionar ao carrinho"
          onClick={onClick}
          disabled={stock === "outofstock"}
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
  variations: PropTypes.object,
  onUpdateTotalPrice: PropTypes.func,
};

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
  color: ${(props) => (props.flag == "sale" ? "gray" : "black")};
  text-decoration: ${(props) =>
    props.flag == "sale" ? "line-through" : "none"};
  font-size: 48px;
`;

const Sale = styled(Price)`
  color: black;
  margin-left: 10px;
`;

const StyledButton = styled(Button)`
  margin-left: 15px;
`;

const Variations = styled.div``;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

export default AddToCart;
