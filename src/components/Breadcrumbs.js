import { Breadcrumb } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import { KebabToTitleCase } from "fragments";

const onClickSectionRegistry = {
  home: (history) => history.push(""),
  "sobre-nos": (history) => history.push("/sobre-nos"),
  produtos: (history) => history.push("/produtos"),
  contactos: (history) => history.push("/contactos"),
};

const Breadcrumbs = ({ page, item }) => {
  const history = useHistory();
  return (
    <StyledBreadcrumb separator=">">
      <Breadcrumb.Item
        href={page}
        onClick={({ key }) => {
          onClickSectionRegistry[key](history);
        }}
      >
        {page == "/" ? "Home" : KebabToTitleCase(page.replace("/", ""))}
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
  margin-bottom: 15px;
  a {
    color: var(--green);

    &:hover {
      color: var(--navy-blue);
    }
  }
`;

export default Breadcrumbs;
