import styled from "styled-components";
import { Layout } from "antd";

const { Footer } = Layout;

const PPS_Footer = () => {
  return <StyledFooter>'tis the footer</StyledFooter>;
};

const StyledFooter = styled(Footer)`
  display: flex;
  padding: 20px 65px;
  background-color: var(--dark-gray);

  && {
    flex-direction: column;
    align-items: center;
  }
`;

export default PPS_Footer;
