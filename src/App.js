import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import Content from "layout/Content";
import Header from "layout/Header";
import Footer from "layout/Footer";

import "./App.scss";

const AppWrapper = () => (
  <PageContainer>
    <App />
  </PageContainer>
);

const App = () => {
  return (
    <Router>
      <Header />
      <Content />
      <Footer />
    </Router>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default AppWrapper;
