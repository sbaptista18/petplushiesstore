import styled from "styled-components";
import PropTypes from "prop-types";

import { Button } from "components";

import { LazyImage } from "fragments";

const Tile = ({ picture, title, price, sale_price, category, flag, size }) => {
  return (
    <Container size={size}>
      {flag && <Flag>{flag}</Flag>}
      {category && <Category>{category}</Category>}
      <LazyImage src={picture} alt={title + " - Pet Plushies"} />
      <Text>
        <Title size={size}>{title}</Title>
        <PriceContainer>
          <Price flag={flag}>{price}</Price>
          {flag == "sale" && <Sale>{sale_price}</Sale>}
        </PriceContainer>
        <StyledButton size="large" type="primary" text="add to cart" />
      </Text>
    </Container>
  );
};

Tile.propTypes = {
  picture: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  sale_price: PropTypes.string,
  category: PropTypes.string,
  flag: PropTypes.string,
  size: PropTypes.string.isRequired,
};

const Container = styled.div`
  width: ${(props) => (props.size == "large" ? "500px" : "200px")};
  height: auto;
  display: flex;
  position: relative;
  flex-direction: column;
`;

const Flag = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: auto;
  height: 30px;
  background-color: var(--black);
  color: var(--white);
  z-index: 1;
  font-size: 14px;
  padding: 5px 10px;
`;

const Category = styled(Flag)`
  left: unset;
  right: 0;
  background-color: var(--green);
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--light-gray);
  padding: 15px;
`;

const Title = styled.div`
  font-size: ${(props) => (props.size == "large" ? "25px" : "20px")};
`;

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

export default Tile;
