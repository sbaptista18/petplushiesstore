import styled from "styled-components";
import { Row, Col, Spin, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import moment from "moment";
import { useTranslation } from "react-i18next";

import { PageHeader } from "components";
import { useLoading } from "reducers";
import i18n from "i18next";

import DummyImg from "assets/images/batcat-1.jpg";

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { setLoadingPage } = useLoading();
  const { t } = useTranslation();
  const lang = localStorage.getItem("lang");

  moment.locale(lang);

  const tableColumns = () => [
    {
      title: `${t("numero")}`,
      dataIndex: "order_id",
      key: "order_id",
      render: (record) => {
        return <div>{record}</div>;
      },
    },
    {
      title: `${t("data")}`,
      dataIndex: "order_date",
      key: "order_date",
      render: (record) => {
        return <div>{moment(record).format(i18n.t("formatoData"))}</div>;
      },
    },
    {
      title: `${t("estado")}`,
      dataIndex: "order_status",
      key: "order_status",
      render: (record) => {
        let status;
        switch (record) {
          case "on-hold":
            status = t("aguardaPagamento");
            break;
          case "processing":
            status = t("emProcessamento");
            break;
          case "shipment-sent":
            status = t("enviada");
            break;
          default:
            status = "default";
            break;
        }
        return <div>{status}</div>;
      },
    },
    {
      title: t("morada"),
      key: "address",
      render: (record, _) => {
        return (
          <div>
            {_.shipping_data.shipping_address_1 != ""
              ? _.shipping_data.shipping_address_1
              : _.billing_data.billing_address_1}
            {`, `}
            {_.shipping_data.shipping_postcode != ""
              ? _.shipping_data.shipping_postcode
              : _.billing_data.billing_postcode}
            {`, `}
            {_.shipping_data.shipping_state != ""
              ? _.shipping_data.shipping_state
              : _.billing_data.billing_state}
            {`, `}
            {_.shipping_data.shipping_country != ""
              ? _.shipping_data.shipping_country
              : _.billing_data.billing_country}
          </div>
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (record) => {
        return (
          <div>
            {record}
            &euro;
          </div>
        );
      },
    },
    {
      title: t("iva"),
      dataIndex: "total",
      key: "total",
      render: (record) => {
        return (
          <div>
            {(record * 0.23).toFixed(2)}
            &euro;
          </div>
        );
      },
    },
  ];
  const tableColumnsProducts = () => [
    {
      title: `${t("imagem")}`,
      key: "image",
      render: (record) => {
        return (
          <img
            src={record.images.main.src}
            style={{ width: "200px", height: "auto" }}
            alt={`${record.name} - Pet Plushies`}
          />
        );
      },
    },
    {
      title: `${t("produto")}`,
      key: "product",
      render: (record) => {
        return (
          <Link target="_blank" to={`/loja/${record.slug}`}>
            {record.name}
          </Link>
        );
      },
    },
    {
      title: `${t("extras")}`,
      key: "extras",
      render: (record) => {
        const extras_info = record.product_extras;

        Object.keys(extras_info).map((key) => (
          <span key={key}>
            <strong>{key}:</strong> {extras_info[key]}
          </span>
        ));
      },
    },
    {
      title: t("quantidade"),
      key: "qtd",
      render: (record) => {
        return <div>{record.quantity}</div>;
      },
    },
    {
      title: t("preco"),
      key: "total",
      render: (record) => {
        return (
          <div>
            {record.total_price}
            &euro;
          </div>
        );
      },
    },
    {
      title: t("iva"),
      key: "iva",
      render: (record) => {
        return (
          <div>
            {record.tax}
            &euro;
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setLoadingPage(true);
    const fetchOrder = async (orderId) => {
      try {
        const response = await fetch(
          `https://backoffice.petplushies.pt/wp-json/wc/v3/get_order_by_id?id=${orderId}`
        );
        const data = await response.json();

        setOrder([data.result]);
        setLoading(false);
        setLoadingPage(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
        setLoadingPage(false);
      }
    };

    fetchOrder(orderId);
  }, [orderId]);

  return (
    <>
      <PageHeader
        title={`${t("encomenda")} #${orderId}`}
        img={DummyImg}
        alt={`${t("encomenda")} #${orderId} - Pet Plushies`}
      />
      <Container>
        <ContentLocked>
          <div style={{ position: "relative", width: "100%" }}>
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
                  rowKey="order_id"
                  scroll={{ x: "100%" }}
                />
                <div>
                  <TableTitle>
                    <h3>Detalhes</h3>
                  </TableTitle>
                  <StyledTable
                    columns={tableColumnsProducts()}
                    dataSource={order[0].products}
                    pagination={false}
                    rowKey="id"
                    scroll={{ x: "100%" }}
                  />
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
    </>
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

const StyledTable = styled(Table)`
  @media screen and (max-width: 992px) {
    margin-bottom: 30px;
  }
  && {
    & .ant-table-empty {
      text-align: center;
    }
    & .ant-table-thead > tr > th {
      background-color: transparent;
      border-color: var(--black);

      &:before {
        display: none;
      }
    }

    & .ant-table-row {
      height: 80px;
    }

    & .ant-table-cell {
      border-color: var(--black);
    }
  }
`;

const Spinner = styled(Spin)`
  position: absolute;
  background-color: var(--white);
  width: 100%;
  height: 500px;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--white);
  position: relative;
`;

const Content = styled(Row)`
  padding: 0 25px;
  width: 100%;
  flex-direction: column;
`;

const ContentLocked = styled(Content)`
  max-width: 1440px;
  margin: auto;
  min-height: 500px;
`;

export default {
  path: "/encomendas/:orderId",
  exact: true,
  component: Order,
};
