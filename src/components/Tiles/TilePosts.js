import styled from "styled-components";
import PropTypes from "prop-types";
import { Col } from "antd";
import { Link } from "react-router-dom";

import { Button } from "components";

import { LazyImage } from "fragments";

const Tile = ({ picture, name, category, url, excerpt, size }) => {
  return (
    <Container span={size == "large" ? "10" : "5"}>
      {category && <Category>{category}</Category>}
      <LazyImage src={picture} alt={name + " - Pet Plushies"} />
      <Text>
        <Title size={size}>{name}</Title>
        <Excerpt>{excerpt}</Excerpt>
        <Link to={"/blog/" + url}>
          <StyledButton size="large" type="primary" text="Ler mais" />
        </Link>
      </Text>
    </Container>
  );
};

Tile.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string,
  category: PropTypes.string,
  size: PropTypes.string,
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
  height: 40px;
`;

const Excerpt = styled(Text)`
  font-size: 14px;
  height: auto;
  text-align: center;
`;

const StyledButton = styled(Button)`
  margin-top: 15px;
`;

export default Tile;
