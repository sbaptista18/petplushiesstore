import styled from "styled-components";
import { Row, Form, Tabs, Spin, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";

import { Button, ModalMessage, PageHeader } from "components";

import { PortugalDistricts } from "../Checkout/data";
import PersonalDataForm from "./Forms/PersonalDataForm";
import AccountDataForm from "./Forms/AccountDataForm";

import { useCart } from "reducers";

import DummyImg from "assets/images/batcat-1.jpg";

const CustomNoData = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    Ainda não efectuou nenhuma encomenda.
  </div>
);

const tableColumns = () => [
  {
    title: "N.º",
    dataIndex: "id",
    key: "number",
    render: (record) => <div>{record}</div>,
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (record) => <div>{record}</div>,
  },
  {
    title: "Detalhes",
    dataIndex: "id",
    key: "order_id",
    render: (record) => (
      <Link to={`/encomendas/${record}`}>
        <StyledButton size="large" text="Ver detalhes" type="primary" />
      </Link>
    ),
  },
];

const MyAccount = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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

  const { clearCartState } = useCart();

  const data = localStorage.getItem("token");

  const storedUserString = localStorage.getItem("user");
  const user = JSON.parse(storedUserString);

  if (localStorage.getItem("token") == null) {
    history.replace("/login");
  }

  useEffect(() => {
    const fetchCustomerData = async (userId) => {
      const options = {
        method: "GET",
        url: `http://127.0.0.1/customers?userId=${userId}`,
      };

      axios
        .request(options)
        .then(function (response) {
          setUserPersonalData(response.data);
          setLoading(false);
        })
        .catch(function (error) {
          setLoading(true);
        });
    };

    fetchCustomerData(user.ID);
    fetchOrders(user.ID);
  }, []);

  const fetchOrders = (userId) => {
    const options = {
      method: "GET",
      url: `http://127.0.0.1/orders/userid`,
    };

    axios
      .request(options)
      .then(function (response) {
        const clientOrders = response.data.filter(
          (order) => order.customer_id === parseInt(userId)
        );
        setOrders(clientOrders);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleLogOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userCart");
    try {
      await axios.post(
        `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/auth/revoke&JWT=${data}`
      );
      clearCartState();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userCart");
      history.replace("/login");
    } catch (error) {
      setError(error.response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userCart");
      history.replace("/login");
      clearCartState();
    }
  };

  const handleSubmitAccountData = () => {
    form.validateFields().then(() => {
      const formValues = form.getFieldsValue();
      const data = {
        ID: user.ID,
        user_email: formValues.email,
      };

      const storedUserString = localStorage.getItem("user");

      const currentUser = JSON.parse(storedUserString);

      currentUser.user_email = data.user_email;

      const updatedUserString = JSON.stringify(currentUser);

      localStorage.setItem("user", updatedUserString);

      const options = {
        method: "PUT",
        url: `http://127.0.0.1/users/id?userId=${user.ID}`,
        data: JSON.stringify({ data }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          if (response.error) {
            setMessage(
              "Houve um erro na actualizaºão do seu e-mail. (" +
                response.error +
                ".)"
            );
            setStatus("error");
            setIsModalOpen(true);
          } else {
            setMessage("O seu e-mail foi actualizado com sucesso.");
            setStatus("success");
            setIsModalOpen(true);
          }
        })
        .catch(function (error) {
          setMessage(
            "Houve um erro na actualização do seu e-mail. (" +
              error.error +
              ".)"
          );
          setStatus("error");
          setIsModalOpen(true);
        });
    });
  };

  const handleSubmitPersonalData = () => {
    form1.validateFields().then(() => {
      const formValues = form1.getFieldsValue();
      const dataUser = {
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

      const options = {
        method: "PUT",
        url: `http://127.0.0.1/customers/id?userId=${user.ID}`,
        data: JSON.stringify({ dataUser }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .request(options)
        .then(function (response) {
          if (response.error) {
            setMessage(
              "Houve um erro na actualização dos seus dados. (" +
                response.error +
                ".)"
            );
            setStatus("error");
            setIsModalOpen(true);
          } else {
            setMessage("Os seus dados foram actualizados com sucesso.");
            setStatus("success");
            setIsModalOpen(true);
          }
        })
        .catch(function (error) {
          setMessage(
            "Houve um erro na actualização dos seus dados. (" +
              error.error +
              ".)"
          );
          setStatus("error");
          setIsModalOpen(true);
        });
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
          columns={tableColumns()}
          dataSource={orders}
          pagination={false}
          rowKey="id"
          locale={{ emptyText: <CustomNoData /> }}
        />
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="A minha conta"
        img={DummyImg}
        alt="A minha conta - Pet Plusies"
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
                <Tabs tabPosition={"left"} items={tabs} />
                <StyledButton
                  size="large"
                  text="Sair da conta"
                  type="primary"
                  htmlType="submit"
                  onClick={() => handleLogOut()}
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
