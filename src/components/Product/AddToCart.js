import styled from "styled-components";
import PropTypes from "prop-types";
import { Col, InputNumber } from "antd";

import { Button } from "components";

const AddToCart = ({
  sku,
  price,
  sale_price,
  flag,
  stock,
  onClick,
  onDataFromChild,
}) => {
  const onChange = (value) => {
    onDataFromChild(value);
  };

  return (
    <Container>
      <Sku>REF: {sku}</Sku>
      <PriceContainer>
        <Price flag={flag}>{price}</Price>
        {flag == "sale" && <Sale>{sale_price}</Sale>}
      </PriceContainer>
      <InputNumber min={1} max={10} defaultValue={1} onChange={onChange} />
      <StyledButton
        size="large"
        type="primary"
        text="Adicionar ao carrinho"
        onClick={onClick}
        disabled={stock === "outofstock"}
      />
    </Container>
  );
};

AddToCart.propTypes = {
  sku: PropTypes.string,
  price: PropTypes.string,
  sale_price: PropTypes.string,
  flag: PropTypes.string,
  stock: PropTypes.string,
  onClick: PropTypes.func,
  onDataFromChild: PropTypes.func,
};

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
  margin-top: 15px;
  margin-left: 15px;
`;

export default AddToCart;
