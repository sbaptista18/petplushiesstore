import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider, AuthProvider } from "reducers";

import Content from "layout/Content";
import Header from "layout/Header";
import Footer from "layout/Footer";

import "./App.scss";

const helmetContext = {};

const AppWrapper = () => (
  <CartProvider>
    <PageContainer>
      <App />
    </PageContainer>
  </CartProvider>
);

const App = () => {
  return (
    <HelmetProvider context={helmetContext}>
      <Router>
        <Header />
        <Content />
        <Footer />
      </Router>
    </HelmetProvider>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default AppWrapper;
