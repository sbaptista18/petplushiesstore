import { Route, Switch, useLocation } from "react-router-dom";
import pages from "pages";
import styled from "styled-components";
import PropTypes from "prop-types";
import NotFound from "../pages/NotFound";

import { ScrollToTop } from "fragments";

const Content = () => {
  const location = useLocation();

  return (
    <Container location={location.pathname}>
      <ScrollToTop />
      <Switch>
        {pages.map((props) => (
          <Route {...props} key={props.path} />
        ))}
        <Route component={NotFound} />
      </Switch>
    </Container>
  );
};

Content.propTypes = {
  path: PropTypes.string,
};

const Container = styled.div`
  margin-top: ${(props) =>
    props.location == "/" ? "0" : "var(--menu-height)"};
  min-height: calc(100vh - var(--menu-height) - 277px);
  background-color: var(--white);

  @media screen and (max-width: 992px) {
    margin-top: ${(props) =>
      props.location == "/" ? "0" : "var(--menu-height-mobile)"};
    min-height: calc(100vh - var(--menu-height-mobile) - 277px);
  }
`;

export default Content;
