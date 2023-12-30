import { BrowserRouter as Router } from "react-router-dom";
import styled from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider, LoadingProvider, useLoading } from "reducers";
import { useEffect } from "react";

import Content from "./layout/Content";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

import "./App.scss";

const helmetContext = {};

const AppWrapper = () => {
  return (
    <CartProvider>
      <LoadingProvider>
        <PageContainer>
          <App />
        </PageContainer>
      </LoadingProvider>
    </CartProvider>
  );
};

const App = () => {
  const { isLoading } = useLoading();
  // Use useEffect to add/remove the 'no-scroll' class to the body
  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Clean up the effect
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isLoading]);

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
