import { Breadcrumb } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

import { KebabToTitleCase } from "fragments";

const Breadcrumbs = ({ page, item }) => {
  return (
    <StyledBreadcrumb separator=">">
      <Breadcrumb.Item href={`/${page}`}>
        {KebabToTitleCase(page)}
      </Breadcrumb.Item>
      <Breadcrumb.Item>{item}</Breadcrumb.Item>
    </StyledBreadcrumb>
  );
};

Breadcrumbs.propTypes = {
  page: PropTypes.string.isRequired,
  item: PropTypes.string.isRequired,
};

const StyledBreadcrumb = styled(Breadcrumb)`
  a {
    color: var(--green);

    &:hover {
      color: var(--navy-blue);
    }
  }
`;

export default Breadcrumbs;
