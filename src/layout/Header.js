import styled from 'styled-components';
import { Layout, Row } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const PPS_Header = () => {
  return (
    <StyledHeader>
      'tis the header
    </StyledHeader>
  )
};

const StyledHeader = styled(Header)`
  position: fixed;
  z-index: 2;
  display: flex;
  width: 100vw;
  height: var(--menu-height);
  padding: 20px 65px;
  background-color: var(--light-gray);

  && {
    flex-direction: column;
    align-items: center;
  }
`;

export default PPS_Header