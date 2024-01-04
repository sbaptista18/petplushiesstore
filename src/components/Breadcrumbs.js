import { Breadcrumb } from "antd";
import styled from "styled-components";
import PropTypes from "prop-types";

import { KebabToTitleCase } from "fragments";
import { useTranslation } from "react-i18next";

const Breadcrumbs = ({ page, item }) => {
  const { t } = useTranslation();

  return (
    <StyledBreadcrumb separator=">">
      <Breadcrumb.Item href={page}>
        {page == "/"
          ? "Home"
          : t(KebabToTitleCase(page.replace("/", "")).toLowerCase())}
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

  @media screen and (max-width: 992px) {
    margin-top: 20px;
  }
  a {
    color: var(--light-blue);

    &:hover {
      color: var(--navy-blue);
    }
  }
`;

export default Breadcrumbs;
