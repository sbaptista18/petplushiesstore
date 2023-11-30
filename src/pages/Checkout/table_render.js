import { Col, InputNumber } from "antd";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const onChange = (value) => {
  console.log("changed", value);
};

// const Product = (text) => {
//   return (
//     <ProductCol>
//       <Col span={16}>
//         <img src={Img} />
//       </Col>
//       <Col span={7}>{text}</Col>
//     </ProductCol>
//   );
// };

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

// export default [
//   {
//     title: "Produto",
//     dataIndex: "product",
//     key: "product",
//     render: (text) => Product(text),
//   },
//   {
//     title: "Quantidade",
//     dataIndex: "qty",
//     key: "qty",
//     render: (text) => (
//       <InputNumber min={1} max={10} defaultValue={text} onChange={onChange} />
//     ),
//   },
//   {
//     title: "Preco",
//     dataIndex: "price",
//     key: "price",
//   },
//   {
//     key: "close",
//     dataIndex: "close",
//     render: () => <DeleteBtn />,
//   },
// ];

const tableColumns = (onQuantityChange) => [
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
    dataIndex: "product",
    key: "qty",
    render: (record, _, recordIndex) => (
      <Qty text={record.qty} recordIndex={recordIndex} />
    ),
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
    render: () => <DeleteBtn />,
  },
];

const DeleteBtn = styled(CloseOutlined)`
  cursor: pointer;
`;

const StyledImg = styled.img`
  max-width: 200px;
  width: 100%;
  height: auto;
`;

export default tableColumns;
