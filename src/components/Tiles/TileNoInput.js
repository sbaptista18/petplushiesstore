import styled from "styled-components";
import PropTypes from "prop-types";
import { Col } from "antd";
import { Link } from "react-router-dom";

import { Button } from "components";
import { useTranslation } from "react-i18next";

import { LazyImage } from "fragments";

const Tile = ({
  picture,
  name,
  price,
  sale_price,
  category,
  flag,
  size,
  stock,
  url,
}) => {
  const { t } = useTranslation();

  return (
    <Container span={size == "large" ? "8" : "5"}>
      {flag && <Flag>{flag}</Flag>}
      {category && <Category>{category}</Category>}
      <LazyImage src={picture} alt={name + " - Pet Plushies"} />
      <Text>
        <Title size={size}>{name}</Title>
        <PriceContainer>
          <Price flag={flag}>{price.toFixed(2)}&euro;</Price>
          {flag == "sale" && <Sale>{sale_price}&euro;</Sale>}
        </PriceContainer>
        <Link to={"/loja/" + url}>
          <StyledButton size="large" type="primary" text={t("verProduto")} />
        </Link>
      </Text>
    </Container>
  );
};

Tile.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  sale_price: PropTypes.number,
  category: PropTypes.string,
  flag: PropTypes.string,
  size: PropTypes.string,
  stock: PropTypes.number,
  url: PropTypes.string,
};

const Container = styled(Col)`
  height: auto;
  display: flex;
  position: relative;
  flex-direction: column;
  margin: 10px 18px;
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
  background-color: var(--light-blue);
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--light-gray);
  padding: 15px;
`;

const Title = styled.div`
  font-size: ${(props) => (props.size == "large" ? "25px" : "18px")};
  text-align: center;
  height: 70px;
`;

const PriceContainer = styled.div`
  display: flex;
`;

const Price = styled.div`
  color: ${(props) =>
    props.flag == "sale" ? "var(--dark-gray)" : "var(--black)"};
  text-decoration: ${(props) =>
    props.flag == "sale" ? "line-through" : "none"};
`;

const Sale = styled(Price)`
  color: var(--black);
  margin-left: 10px;
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
`;

export default Tile;
