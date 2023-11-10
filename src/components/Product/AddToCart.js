import styled from "styled-components";
import PropTypes from "prop-types";
import { Col, InputNumber } from "antd";

import { Button } from "components";

const AddToCart = ({ title, sku, price, sale_price, flag }) => {
  const onChange = (value) => {
    console.log("changed", value);
  };
  return (
    <Container>
      <Title>{title}</Title>
      <Sku>REF: {sku}</Sku>
      <PriceContainer>
        <Price flag={flag}>{price}</Price>
        {flag == "sale" && <Sale>{sale_price}</Sale>}
      </PriceContainer>
      <InputNumber min={1} max={10} defaultValue={1} onChange={onChange} />
      <StyledButton size="large" type="primary" text="add to cart" />
    </Container>
  );
};

AddToCart.propTypes = {
  title: PropTypes.string.isRequired,
  sku: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  sale_price: PropTypes.string,
  flag: PropTypes.string,
};

const Container = styled(Col)`
  flex-direction: column;
`;

const Title = styled.div`
  font-size: ${(props) => (props.size == "large" ? "25px" : "20px")};
`;

const Sku = styled.div``;

const PriceContainer = styled.div`
  display: flex;
`;

const Price = styled.div`
  color: ${(props) => (props.flag == "sale" ? "gray" : "black")};
  text-decoration: ${(props) =>
    props.flag == "sale" ? "line-through" : "none"};
`;

const Sale = styled(Price)`
  color: black;
  margin-left: 10px;
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
`;

export default AddToCart;
