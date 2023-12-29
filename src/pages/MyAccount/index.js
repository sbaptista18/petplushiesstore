import styled from "styled-components";
import { Row, Form, Tabs, Spin, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";

import { Button, ModalMessage, PageHeader } from "components";

import { PortugalDistricts } from "../Checkout/data";
import PersonalDataForm from "./Forms/PersonalDataForm";
import AccountDataForm from "./Forms/AccountDataForm";

import DummyImg from "assets/images/batcat-1.jpg";

const CustomNoData = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    Ainda não efectuou nenhuma encomenda.
  </div>
);

const tableColumns = [
  {
    title: "N.º",
    key: "number",
    render: (record) => {
      return <div key={record.order_id}>{record.order_id}</div>;
    },
  },
  {
    title: "Total",
    key: "total",
    render: (record) => {
      return <div key={record.order_total}>{record.order_total}</div>;
    },
  },
  {
    title: "Detalhes",
    key: "order",
    render: (record) => {
      return (
        <Link key={record.order_id} to={`/encomendas/${record.order_id}`}>
          <StyledButton size="large" text="Ver detalhes" type="primary" />
        </Link>
      );
    },
  },
];

const MyAccount = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [userPersonalData, setUserPersonalData] = useState({});
  const [country, setCountry] = useState("");
  const [secondSelectOptions, setSecondSelectOptions] = useState([""]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);

  const history = useHistory();

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const storedUserString = localStorage.getItem("user");
  const user = JSON.parse(storedUserString) || {};

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      history.replace("/login");
    } else {
      const fetchCustomerData = async (userId) => {
        try {
          const response = await fetch(
            `https://backoffice.petplushies.pt/wp-json/wc/v3/get_customer_data?userId=${userId}`
          );
          const responseData = await response.json();
          setUserPersonalData(responseData);
          setLoading(false);
        } catch (error) {
          setLoading(true);
        }
      };

      fetchCustomerData(user.ID);
    }
  }, [history, user]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(
        `https://backoffice.petplushies.pt/wp-json/wc/v3/get_orders?userId=${userId}`
      );
      const responseData = await response.json();
      setOrders(responseData);
      setLoadingTable(false);
    } catch (error) {
      setLoading(true);
    }
  };

  const handleSubmitAccountData = () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();
      const userData = {
        ID: user.ID,
        user_email: formValues.email,
      };

      try {
        const response = await fetch(
          "https://backoffice.petplushies.pt/wp-json/wc/v3/update_account_data",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData }),
          }
        );
        const responseData = await response.json();
        if (responseData.success) {
          const storedUserString = localStorage.getItem("user");

          const currentUser = JSON.parse(storedUserString);
          currentUser.user_email = userData.user_email;

          const updatedUserString = JSON.stringify(currentUser);
          localStorage.setItem("user", updatedUserString);

          setMessage(responseData.message);
          setStatus("success");
          setIsModalOpen(true);
        } else {
          setMessage(responseData.message);
          setStatus("error");
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleSubmitPersonalData = () => {
    form1.validateFields().then(async () => {
      const formValues = form1.getFieldsValue();
      const userData = {
        id: user.ID,
        billing: {
          first_name: formValues.first_name,
          last_name: formValues.surname,
          company: formValues.company !== "" ? formValues.company : "",
          address_1: formValues.address,
          address_2: "",
          city: formValues.local,
          state: formValues.district,
          postcode: formValues.postcode,
          country: formValues.country == "PT" ? "PT" : "",
          email: formValues.email,
          phone: formValues.phone,
        },
        shipping: {
          first_name: formValues.first_name_other,
          last_name: formValues.surname_other,
          company:
            formValues.company_other !== "" ? formValues.company_other : "",
          address_1: formValues.address_other,
          address_2: "",
          city: formValues.local_other,
          state: formValues.district_other,
          postcode: formValues.postcode_other,
          country: formValues.country_other == "PT" ? "PT" : "",
        },
      };

      try {
        const response = await fetch(
          "https://backoffice.petplushies.pt/wp-json/wc/v3/update_personal_data",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userData }),
          }
        );
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.success) {
          setMessage(responseData.message);
          setStatus("success");
          setIsModalOpen(true);
        } else {
          setMessage(responseData.message);
          setStatus("error");
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleCountry = (value) => {
    setCountry(value);

    if (value === "PT") {
      setSecondSelectOptions(PortugalDistricts);
    } else {
      setSecondSelectOptions([]);
    }
  };

  const handleCountryShipping = (value) => {
    setCountry(value);

    if (value === "PT") {
      setSecondSelectOptions(PortugalDistricts);
    } else {
      setSecondSelectOptions([]);
    }
  };

  const tabs = [
    {
      label: `Dados da Conta`,
      key: "account_data",
      children: (
        <AccountDataForm
          form={form}
          data={user.user_email}
          handleSubmitAccountData={handleSubmitAccountData}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      ),
    },
    {
      label: `Dados Pessoais`,
      key: "personal_data",
      children: (
        <PersonalDataForm
          form={form1}
          data={userPersonalData}
          handleCountry={handleCountry}
          handleCountryShipping={handleCountryShipping}
          country={country}
          secondSelectOptions={secondSelectOptions}
          handleSubmitPersonalData={handleSubmitPersonalData}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      ),
    },
    {
      label: `Encomendas`,
      key: "orders",
      children: (
        <StyledTable
          columns={tableColumns}
          dataSource={orders}
          pagination={false}
          rowKey="order_id"
          locale={{ emptyText: <CustomNoData /> }}
          loading={loadingTable}
        />
      ),
    },
  ];

  const handleTabChange = (key) => {
    if (key == "orders") {
      //get a spinner to load inside the tab element
      setLoadingTable(true);
      fetchOrders(user.ID);
    }
  };

  return (
    <>
      <PageHeader
        title="A minha conta"
        img={DummyImg}
        alt="A minha conta - Pet Plushies"
      />
      <Container>
        <ModalMessage
          status={status}
          message={message}
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <ContentLocked>
          <div style={{ position: "relative" }}>
            {loading && !error && (
              <Spinner
                indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
              />
            )}

            {!loading && !error && (
              <div>
                <Tabs
                  tabPosition={"left"}
                  items={tabs}
                  onChange={handleTabChange}
                />
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

const StyledTable = styled(Table)`
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

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default {
  path: "/minha-conta",
  exact: true,
  component: MyAccount,
};
