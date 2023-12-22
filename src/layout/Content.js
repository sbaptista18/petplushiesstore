import { Route, Switch, useLocation } from "react-router-dom";
import pages from "pages";
import styled from "styled-components";
import PropTypes from "prop-types";

const Content = () => {
  const location = useLocation();

  return (
    <Container location={location.pathname}>
      <Switch>
        {pages.map((props) => (
          <Route {...props} key={props.path} />
        ))}
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
`;

export default Content;
