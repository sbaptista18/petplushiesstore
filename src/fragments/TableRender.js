import { InputNumber } from "antd";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Text = ({ text, slug }) => {
  return <Link to={`/produtos/${slug}`}>{text}</Link>;
};

const Price = ({ text }) => {
  return text;
};

const Image = ({ image }) => {
  return <StyledImg src={image} alt={image} />;
};

const tableColumns = (onQuantityChange, onDelete) => [
  {
    title: "Imagem",
    dataIndex: "product",
    key: "image",
    render: (record, _, recordIndex) => (
      <Image image={record.images[0].src} recordIndex={recordIndex} />
    ),
  },
  {
    title: "Nome",
    dataIndex: "product",
    key: "name",
    render: (record, _, recordIndex) => (
      <Text text={record.name} slug={record.slug} recordIndex={recordIndex} />
    ),
  },
  {
    title: "Quantidade",
    dataIndex: "product_qty",
    key: "qty",
    render: (record, _, recordIndex) => {
      return (
        <InputNumber
          min={1}
          max={10}
          defaultValue={record}
          onChange={(value) =>
            onQuantityChange(value, recordIndex, _.product_id, _.product.price)
          }
        />
      );
    },
  },
  {
    title: "Preco",
    dataIndex: "product_net_revenue",
    key: "price",
    render: (record) => <Price text={record} />,
  },
  {
    key: "close",
    dataIndex: "close",
    render: (_, record, recordIndex) => (
      <DeleteBtn onClick={() => onDelete(recordIndex, record.product_id)} />
    ),
  },
];

Text.propTypes = {
  text: PropTypes.string,
  slug: PropTypes.string,
};

Price.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Image.propTypes = {
  image: PropTypes.string,
};

const StyledImg = styled.img`
  max-width: 200px;
  width: 100%;
  height: auto;
`;

const DeleteBtn = styled(CloseOutlined)`
  cursor: pointer;
`;

export default tableColumns;
