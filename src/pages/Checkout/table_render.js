import { Col, InputNumber } from "antd";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

import Img from "assets/images/batcat-1.jpg";

const onChange = (value) => {
  console.log("changed", value);
};

const Product = (text) => {
  return (
    <ProductCol>
      <Col span={16}>
        <img src={Img} />
      </Col>
      <Col span={7}>{text}</Col>
    </ProductCol>
  );
};

export default [
  {
    title: "Produto",
    dataIndex: "product",
    key: "product",
    render: (text) => Product(text),
  },
  {
    title: "Quantidade",
    dataIndex: "qty",
    key: "qty",
    render: (text) => (
      <InputNumber min={1} max={10} defaultValue={text} onChange={onChange} />
    ),
  },
  {
    title: "Preco",
    dataIndex: "price",
    key: "price",
  },
  {
    key: "close",
    dataIndex: "close",
    render: () => <DeleteBtn />,
  },
];

const ProductCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100px;

  & img {
    height: 100px;
    width: auto;
  }

  & div:nth-child(2) {
    height: auto;
    text-align: left;
  }
`;

const DeleteBtn = styled(CloseOutlined)`
  cursor: pointer;
`;
