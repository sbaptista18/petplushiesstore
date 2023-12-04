import styled from "styled-components";
import { Row, Form, Tabs, Spin, Table } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useHistory, Link } from "react-router-dom";

import { Button, ModalMessage } from "components";
import { ConnectWC } from "fragments";

import { PortugalDistricts } from "../Checkout/data";
import PersonalDataForm from "./Forms/PersonalDataForm";
import AccountDataForm from "./Forms/AccountDataForm";

const CustomNoData = () => (
  <div style={{ textAlign: "center", padding: "20px" }}>
    Ainda nao efectuou nenhuma encomenda.
  </div>
);

const tableColumns = () => [
  {
    title: "No.",
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
        <StyledButton
          size="large"
          color="green"
          text="Ver detalhes"
          type="primary"
        />
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

  const location = useLocation();
  const history = useHistory();

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const data = location.state?.data;

  const storedUserString = localStorage.getItem("user");
  const user = JSON.parse(storedUserString);

  if (localStorage.getItem("token") == null) {
    history.replace("/login");
  }

  useEffect(() => {
    const fetchCustomerData = async (userId) => {
      ConnectWC.get("customers/" + userId)
        .then((response) => {
          setUserPersonalData(response);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(true);
        });
    };

    fetchCustomerData(user.ID);
    fetchOrders(user.ID);
  }, []);

  const fetchOrders = (userId) => {
    ConnectWC.get("orders")
      .then((response) => {
        const clientOrders = response.filter(
          (order) => order.customer_id === parseInt(userId)
        );
        setOrders(clientOrders);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogOut = async () => {
    try {
      const response = await axios.post(
        `https://backoffice.petplushies.pt/?rest_route=/simple-jwt-login/v1/auth/revoke&JWT=${data}`
      );

      if (response.data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userCart");
        history.replace("/login");
      }
    } catch (error) {
      setError(error.response.data.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userCart");
      history.replace("/login");
    }
  };

  const handleSubmitAccountData = () => {
    form.validateFields().then(() => {
      const formValues = form.getFieldsValue();
      const data = {
        ID: user.ID,
        user_email: formValues.email,
      };

      // Retrieve the current user object from localStorage
      const storedUserString = localStorage.getItem("user");

      // Parse the JSON string into an object
      const currentUser = JSON.parse(storedUserString);

      // Update the properties of the user object
      currentUser.user_email = data.user_email;

      // Convert the updated object back to a JSON string
      const updatedUserString = JSON.stringify(currentUser);

      // Update the localStorage variable with the new JSON string
      localStorage.setItem("user", updatedUserString);

      ConnectWC.put("users/" + data.ID, data)
        .then((response) => {
          if (response.error) {
            setMessage(
              "Houve um erro na actualizacao do seu e-mail. (" +
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
        .catch((error) => {
          setMessage(
            "Houve um erro na actualizacao do seu e-mail. (" +
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
      const data = {
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

      ConnectWC.put("customers/" + user.ID, data)
        .then((response) => {
          if (response.error) {
            setMessage(
              "Houve um erro na actualizacao dos seus dados. (" +
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
        .catch((error) => {
          setMessage(
            "Houve um erro na actualizacao do seus dados. (" +
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
      // Handle other countries or set a default set of options
      setSecondSelectOptions([]);
    }
  };

  const handleCountryShipping = (value) => {
    setCountry(value);

    // Set options for the second Select based on the selected country
    if (value === "PT") {
      // If Portugal is selected, set specific options
      setSecondSelectOptions(PortugalDistricts);
    } else {
      // Handle other countries or set a default set of options
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
    <Container>
      <ModalMessage
        status={status}
        message={message}
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <ContentLocked>
        <StyledH1>A minha conta</StyledH1>
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
                color="green"
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
  );
};

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

const StyledButton = styled(Button)`
  max-width: 250px;
  width: 100%;
`;

export default {
  path: "/minha-conta",
  exact: true,
  component: MyAccount,
};
