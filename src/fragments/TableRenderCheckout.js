import styled from "styled-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Text = ({ text, slug }) => {
  return <Link to={`/produtos/${slug}`}>{text}</Link>;
};

const Price = ({ text }) => {
  return text;
};

const Qty = ({ text }) => {
  return text;
};

const Image = ({ image }) => {
  return <StyledImg src={image} alt={image} />;
};

const tableColumnsCheckout = [
  {
    title: "Imagem",
    dataIndex: "product",
    key: "image",
    render: (record) => <Image image={record.images[0].src} />,
  },
  {
    title: "Nome",
    dataIndex: "product",
    key: "name",
    render: (record) => <Text text={record.name} slug={record.slug} />,
  },
  {
    title: "Quantidade",
    dataIndex: "product_qty",
    key: "qty",
    render: (record) => <Qty text={record} />,
  },
  {
    title: "Preco",
    dataIndex: "product_net_revenue",
    key: "price",
    render: (record) => <Price text={`${parseFloat(record)}€`} />,
  },
];

Text.propTypes = {
  text: PropTypes.string,
  slug: PropTypes.string,
};

Price.propTypes = {
  text: PropTypes.string,
};

Qty.propTypes = {
  text: PropTypes.string,
};

Image.propTypes = {
  image: PropTypes.string,
};

const StyledImg = styled.img`
  max-width: 100px;
  width: 100%;
  height: auto;
`;

export default tableColumnsCheckout;
