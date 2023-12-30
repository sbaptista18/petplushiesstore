import { InputNumber } from "antd";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Text = ({ text, slug }) => {
  return <Link to={`/loja/${slug}`}>{text}</Link>;
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
    dataIndex: "main_image_url",
    key: "image",
    render: (record, _, recordIndex) => {
      return <Image image={record} recordIndex={recordIndex} />;
    },
  },
  {
    title: "Nome",
    key: "name",
    render: (record, _, recordIndex) => {
      return (
        <Text text={record.name} slug={record.slug} recordIndex={recordIndex} />
      );
    },
  },
  {
    title: "Extras",
    dataIndex: "product_extras",
    key: "extras",
    render: (record) => {
      return <div dangerouslySetInnerHTML={{ __html: record }} />;
    },
  },
  {
    title: "Quantidade",
    key: "qty",
    render: (record, _, recordIndex) => {
      return (
        <InputNumber
          min={1}
          max={10}
          defaultValue={record.product_qty}
          onChange={(value) =>
            onQuantityChange(
              value,
              recordIndex,
              record.id,
              record.unit_gross_revenue,
              record.unit_net_revenue,
              record.unit_tax_amount
            )
          }
        />
      );
    },
  },
  {
    title: "Preço",
    key: "price",
    render: (record) => {
      return (
        <Price
          text={`${parseFloat(record.product_gross_revenue).toFixed(2)}€`}
        />
      );
    },
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
