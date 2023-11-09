import styled from 'styled-components';
import { Layout, Row } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const PPS_Header = () => {
  return (
    <StyledHeader>
      <MenuRow>
        <StyledLink to="/">
          {<LogoImage src="" />}
        </StyledLink>
        <StyledMenuContainer>

        </StyledMenuContainer>
      </MenuRow>
    </StyledHeader>
  )
};

const StyledLink = styled(Link)`
  display: flex;
  flex: 0 1 auto;
`

const StyledMenuContainer = styled.div`
  display: flex;
  justify-content: space-between;

  & > div:first-of-type {
    height: 100%;
    display: flex;
    flex: auto;
  }
`
const LogoImage = styled.img`
  width: 200px;
  height: auto;

  & path,
  & polygon {
    fill: var(--green);
  }

  @media screen and (max-width: 1200px) {
    width: 141px;

    &.open {
      & path,
      & polygon {
        fill: var(--white);
      }
    }

    &.submenu-open {
      & path,
      & polygon {
        fill: var(--green);
      }
    }
  }
`;
const StyledHeader = styled(Header)`
  position: fixed;
  z-index: 2;
  display: flex;
  width: 100vw;
  height: var(--menu-height);
  padding: 20px 65px;
  background-color: var(--white);

  && {
    flex-direction: column;
    align-items: center;
  }
`;
const MenuRow = styled(Row)`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
`
export default PPS_Header