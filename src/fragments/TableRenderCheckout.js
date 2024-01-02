import styled from "styled-components";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Text = ({ text, slug }) => {
  return <Link to={`/loja/${slug}`}>{text}</Link>;
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

const tableColumnsCheckout = (t) => {
  return [
    {
      title: t("imagem"),
      dataIndex: "main_image_url",
      key: "image",
      render: (record) => <Image image={record} />,
    },
    {
      title: t("produto"),
      key: "name",
      render: (record) => <Text text={record.name} slug={record.slug} />,
    },
    {
      title: t("extras"),
      dataIndex: "product_extras",
      key: "extras",
      render: (record) => {
        return <div dangerouslySetInnerHTML={{ __html: record }} />;
      },
    },
    {
      title: t("quantidade"),
      dataIndex: "product_qty",
      key: "qty",
      render: (record) => <Qty text={record} />,
    },
    {
      title: t("preco"),
      dataIndex: "product_gross_revenue",
      key: "price",
      render: (record) => <Price text={`${parseFloat(record).toFixed(2)}€`} />,
    },
  ];
};

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
