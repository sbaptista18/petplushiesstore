import styled from "styled-components";
import { Row, Col, Spin, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";

const tableColumns = () => [
  {
    title: "No.",
    dataIndex: "id",
    key: "id",
    render: (record) => {
      return <div>{record}</div>;
    },
  },
  {
    title: "Data",
    dataIndex: "date_created",
    key: "date_created",
    render: (record) => {
      return <div>{moment(record).format("MMMM Do YYYY")}</div>;
    },
  },
  {
    title: "Estado",
    dataIndex: "status",
    key: "status",
    render: (record) => {
      let status;
      switch (record) {
        case "on-hold":
          status = "Aguarda confirmação de pagamento";
          break;
        case "processing":
          status = "Em processamento";
          break;
        default:
          status = "default";
          break;
      }
      return <div>{status}</div>;
    },
  },
  {
    title: "Morada",
    dataIndex: "order",
    key: "address",
    render: (record, _, recordIndex) => {
      return (
        <div>
          {_.shipping.address_1 != ""
            ? _.shipping.address_1
            : _.billing.address_1}
          {`, `}
          {_.shipping.postcode != "" ? _.shipping.postcode : _.billing.postcode}
          {`, `}
          {_.shipping.state != "" ? _.shipping.state : _.billing.state}
          {`, `}
          {_.shipping.country != "" ? _.shipping.country : _.billing.country}
        </div>
      );
    },
  },
  {
    title: "Total",
    dataIndex: "order",
    key: "order",
    render: (record, _, recordIndex) => {
      return (
        <div>
          {_.total}
          {_.currency_symbol}
        </div>
      );
    },
  },
];

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchOrder = (orderId) => {
      const options = {
        method: "GET",
        url: `http://localhost:8000/orders?id=${orderId}`,
      };

      return axios
        .request(options)
        .then((response) => {
          const productPromises = response.data.line_items.map((item) => {
            const prodId = item.product_id;

            const options = {
              method: "GET",
              url: `http://localhost:8000/products/id?id=${prodId}`,
            };

            return axios
              .request(options)
              .then((productResponse) => productResponse.data.slug)
              .catch((error) => {
                return null;
              });
          });

          Promise.all(productPromises)
            .then((productSlugs) => {
              const updatedOrder = {
                ...response.data,
                slugs: productSlugs,
                line_items: response.data.line_items.map((item, index) => {
                  return {
                    ...item,
                    slug: productSlugs[index],
                  };
                }),
              };
              setOrder([updatedOrder]);
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
            });
        })
        .catch(function (error) {
          setError(true);
          setLoading(false);
        });
    };

    fetchOrder(orderId);
  }, [orderId]);

  return (
    <Container>
      <ContentLocked>
        <StyledH1>Encomenda #{orderId}</StyledH1>
        <div style={{ position: "relative" }}>
          {loading && !error && (
            <Spinner
              indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
            />
          )}

          {!loading && !error && (
            <div>
              <StyledTable
                columns={tableColumns()}
                dataSource={order}
                pagination={false}
                rowKey="id"
              />
              <div>
                <TableTitle>
                  <h3>Detalhes</h3>
                </TableTitle>
                <TableHeader>
                  <StyledCol span={3}>Imagem</StyledCol>
                  <StyledCol span={8}>Produto</StyledCol>
                  <StyledCol span={6}>Quantidade</StyledCol>
                  <StyledCol span={6}>Preço</StyledCol>
                </TableHeader>
                {order[0].line_items.map((i) => {
                  return (
                    <StyledRow key={i.id}>
                      <StyledCol span={3}>
                        <img
                          src={i.image.src}
                          style={{ width: "100%", height: "auto" }}
                        />
                      </StyledCol>
                      <StyledCol span={8}>
                        <Link target="_blank" to={`/produtos/${i.slug}`}>
                          {i.name}
                        </Link>
                      </StyledCol>
                      <StyledCol span={6}>{i.quantity}</StyledCol>
                      <StyledCol span={6}>
                        {i.price}
                        {order[0].currency_symbol}
                      </StyledCol>
                    </StyledRow>
                  );
                })}
              </div>
            </div>
          )}

          {error && (
            <div
              style={{ color: "red" }}
              dangerouslySetInnerHTML={{ __html: error }}
            ></div>
          )}
        </div>
      </ContentLocked>
    </Container>
  );
};

const TableTitle = styled(Row)`
  margin-top: 30px;
  height: 50px;
  align-items: center;

  & > h3 {
    margin: 0;
  }
`;

const TableHeader = styled(Row)`
  justify-content: space-between;
  height: 80px;
`;

const StyledRow = styled(Row)`
  justify-content: space-between;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  padding: 15px 0;
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
`;

const StyledTable = styled(Table)`
  && {
    & .ant-table-empty {
      text-align: center;
    }
    & .ant-table-thead > tr > th {
      background-color: transparent;
      border-color: black;

      &:before {
        display: none;
      }
    }

    & .ant-table-row {
      height: 80px;
    }

    & .ant-table-cell {
      border-color: black;
    }
  }
`;

const Spinner = styled(Spin)`
  position: absolute;
  background-color: white;
  width: 100%;
  height: 500px;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledH1 = styled.h1`
  margin-top: 30px;
  font-size: 52px;
`;

const Container = styled.div`
  width: 100%;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
`;

export default {
  path: "/encomendas/:orderId",
  exact: true,
  component: Order,
};
