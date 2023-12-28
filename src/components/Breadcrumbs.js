import { Breadcrumb } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

import { KebabToTitleCase } from "fragments";

const Breadcrumbs = ({ page, item }) => {
  return (
    <StyledBreadcrumb separator=">">
      <Breadcrumb.Item href={page}>
        {page == "/" ? "Home" : KebabToTitleCase(page.replace("/", ""))}
      </Breadcrumb.Item>
      <Breadcrumb.Item>{item}</Breadcrumb.Item>
    </StyledBreadcrumb>
  );
};

Breadcrumbs.propTypes = {
  page: PropTypes.string.isRequired,
  item: PropTypes.string,
};

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 15px;
  a {
    color: var(--light-blue);

    &:hover {
      color: var(--navy-blue);
    }
  }
`;

export default Breadcrumbs;
