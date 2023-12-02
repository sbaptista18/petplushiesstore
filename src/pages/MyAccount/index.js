import styled from "styled-components";
import { Row } from "antd";
import { useState } from "react";
import axios from "axios";
import { useLocation, useHistory } from "react-router-dom";

import { Button } from "components";

const MyAccount = () => {
  const [error, setError] = useState("");

  const location = useLocation();
  const history = useHistory();

  const data = location.state?.data;

  const storedUserString = localStorage.getItem("user");
  const user = JSON.parse(storedUserString);

  if (localStorage.getItem("token") == null) {
    history.replace("/login");
  }

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

  return (
    <Container>
      <ContentLocked>
        <span>Username: </span> {user.display_name}
        <br />
        <span>E-mail: </span> {user.user_email}
        <br />
        <span>Nickname: </span> {user.user_nicename}
        <br />
        <StyledButton
          size="large"
          color="green"
          text="Sair da conta"
          type="primary"
          htmlType="submit"
          onClick={() => handleLogOut()}
        />
        {error && (
          <div
            style={{ color: "red" }}
            dangerouslySetInnerHTML={{ __html: error }}
          ></div>
        )}
      </ContentLocked>
    </Container>
  );
};

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
