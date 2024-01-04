import styled from "styled-components";
import { Row, Form, Tabs, Spin, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { Button, ModalMessage, PageHeader } from "components";
import { SEOTags } from "fragments";
import { useCart, useLoading } from "reducers";
import { useTranslation } from "react-i18next";

import PersonalDataForm from "./Forms/PersonalDataForm";
import AccountDataForm from "./Forms/AccountDataForm";

import DummyImg from "assets/images/batcat-1.jpg";

const CustomNoData = () => {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      {t("semEncomendas")}
    </div>
  );
};

const MyAccount = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [userPersonalData, setUserPersonalData] = useState({});
  const [country, setCountry] = useState("");
  const [secondSelectOptions, setSecondSelectOptions] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState();
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingButton, setLoadingButton] = useState(false);
  const { t } = useTranslation();

  const history = useHistory();

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const storedUserString = localStorage.getItem("user");
  const user = JSON.parse(storedUserString) || {};

  const { isLoggedIn } = useCart();
  const { setLoadingPage } = useLoading();
  const isMobile = useMediaQuery({ maxWidth: 992 });

  const tableColumns = [
    {
      title: `${t("numero")}`,
      key: "number",
      render: (record) => {
        return <div key={record.order_id}>{record.order_id}</div>;
      },
    },
    {
      title: "Total",
      key: "total",
      render: (record) => {
        return <div key={record.order_total}>{record.order_total}&euro;</div>;
      },
    },
    {
      title: `${t("detalhes")}`,
      key: "order",
      render: (record) => {
        return (
          <Link key={record.order_id} to={`/encomendas/${record.order_id}`}>
            <StyledButton size="large" text={t("verDetalhes")} type="primary" />
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    setLoadingPage(true);
    if (!isLoggedIn) {
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
          setLoadingPage(false);
        } catch (error) {
          setLoading(true);
          setLoadingPage(false);
          setError(true);
        }
      };
      fetchCustomerData(user.ID);
    }
  }, [history, user.ID, isLoggedIn]);

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
      setLoadingPage(false);
      setError(true);
    }
  };

  const handleSubmitAccountData = () => {
    setLoadingButton(true);
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue();
      const userData = {
        ID: user.ID,
        name: formValues.name,
        user_email: formValues.email,
        password: formValues.password,
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
        form.resetFields();
        if (responseData.success) {
          const storedUserString = localStorage.getItem("user");

          const currentUser = JSON.parse(storedUserString);
          if (userData.user_email != undefined)
            currentUser.user_email = userData.user_email;
          if (userData.name != undefined)
            currentUser.display_name = userData.name;

          const updatedUserString = JSON.stringify(currentUser);
          localStorage.setItem("user", updatedUserString);

          setMessage(responseData.message);

          setStatus("success");
          setIsModalOpen(true);
          setLoadingButton(false);
        } else {
          setMessage(responseData.message);

          setStatus("error");
          setIsModalOpen(true);
          setLoadingButton(false);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleSubmitPersonalData = () => {
    setLoadingButton(true);
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
          country: formValues.country,
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
          country: formValues.country_other,
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
          setLoadingButton(false);
        } else {
          setMessage(responseData.message);
          setStatus("error");
          setIsModalOpen(true);
          setLoadingButton(false);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleCountry = (value) => {
    setCountry(value);
    setSecondSelectOptions(value);
  };

  const handleCountryShipping = (value) => {
    setCountry(value);
    setSecondSelectOptions(value);
  };

  const tabs = [
    {
      label: `${t("dadosConta")}`,
      key: "account_data",
      children: (
        <>
          <div>
            {t("email")}: {user.user_email}
          </div>
          <div>
            {t("nome")} ({t("nomeDesc")}): {user.display_name}
          </div>
          <AccountDataForm
            form={form}
            data={user.user_email}
            handleSubmitAccountData={handleSubmitAccountData}
            disabled={disabled}
            setDisabled={setDisabled}
            loadingButton={loadingButton}
          />
        </>
      ),
    },
    {
      label: `${t("dadosPessoais")}`,
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
          loadingButton={loadingButton}
        />
      ),
    },
    {
      label: `${t("encomendas")}`,
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
      <SEOTags
        title={`${t("minhaConta")} - Pet Plushies`}
        description=""
        name="PetPlushies"
        type="website"
        image={DummyImg}
      />
      <PageHeader
        title={`${t("minhaConta")}`}
        img={DummyImg}
        alt={`${t("minhaConta")} - Pet Plushies`}
      />
      <Container>
        <ModalMessage
          status={status}
          message={message}
          isVisible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        <ContentLocked>
          <div style={{ position: "relative", width: "100%" }}>
            {loading && !error && (
              <Spinner
                indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
              />
            )}

            {!loading && !error && (
              <div>
                <Tabs
                  style={{ width: "100%" }}
                  tabPosition={isMobile ? "top" : "left"}
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
