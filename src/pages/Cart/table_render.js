import { InputNumber } from "antd";
import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

const onChange = (value, rowData) => {
  console.log("changed", value);
  console.log("rowData", rowData);
  // Add your logic to update the state based on the changes
};

const Text = ({ text }) => {
  return text;
};

const Image = ({ image }) => {
  return <StyledImg src={image} alt="Product" />;
};

export default [
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
    render: (record) => <Text text={record.name} />,
  },
  {
    title: "Quantidade",
    dataIndex: "product_qty",
    key: "qty",
    render: (record) => (
      <InputNumber min={1} max={10} defaultValue={record} onChange={onChange} />
    ),
  },
  {
    title: "Preco",
    dataIndex: "product_net_revenue",
    key: "price",
    render: (record) => <Text text={record} />,
  },
  {
    key: "close",
    dataIndex: "close",
    render: () => <DeleteBtn />,
  },
];

const StyledImg = styled.img`
  max-width: 200px;
  width: 100%;
  height: auto;
`;

const ProductCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 300px;
  width: 100%;
  height: 200px;

  & img {
    height: 200px;
    width: auto;
  }

  & div:nth-child(2) {
    height: auto;
    text-align: center;
  }
`;

const DeleteBtn = styled(CloseOutlined)`
  cursor: pointer;
`;
