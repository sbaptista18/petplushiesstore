import styled from 'styled-components';
import { Button } from 'antd';

export default ({ size, type, color, text, ...rest }) => {
  return (
    <StyledButton
      size={size}
      type={type}
      className={color}
      {...rest}
    >
      <span>{text}</span>
    </StyledButton>
  )
}

const StyledButton = styled(Button)`
  border-radius: 31px;
  font-family: 'Rubik';
  padding: 10px 25px;
  border: none;
  box-shadow: none;
  transition: .1s;
  cursor: pointer;

  &.ant-btn-lg {
    font-size: 14px;
    font-weight: 500;
    height: unset;
  }

  &.ant-btn-primary {
    &.green {
      background-color: var(--green);
      color: var(--white);
    }

    &.light-green {
      background-color: var(--light-green);
      color: var(--green);
    }

    &.dark-orange {
      background-color: var(--dark-orange);
      color: var(--white);
    }

    &:hover {
      transform: scale(1.1);

      &.green {
        background-color: var(--green-onhover);
      }

      &.dark-orange {
        background-color: var(--dark-orange-onhover);
      }
    }

    &:active {
      &.green {
        background-color: var(--dark-green);
      }

      &.light-green {
        background-color: var(--light-green-active);
        color: var(--green);
      }

      &.dark-orange {
        background-color: var(--dark-orange-active);
      }
    }
  }

  &.ant-btn-secondary {
    border: 1px solid;
    background-color: transparent;
    border: 1px solid var(--white);

    &.green {
      color: var(--green);
      border-color: var(--green);

      &:hover {
        transform: scale(1.1);
      }

      &:active {
        border: 2px solid var(--green-onhover);
        color: var(--green-onhover);
      }
    }

    &.light-green {
      color: var(--light-green);
      border-color: var(--light-green);

      &:hover {
        border: 2px solid var(--white);
        transform: scale(1.1);
        color: var(--white);
      }

      &:active {
        border: 2px solid var(--white);
        color: var(--white);
      }
    }

    &.light-orange {
      color: var(--light-orange2);
      border-color: var(--light-orange2);

      &:hover {
        border: 2px solid var(--white);
        transform: scale(1.1);
        color: var(--white);
      }

      &:active {
        border: 2px solid var(--white);
        color: var(--white);
      }
    }

    &:active {
      border: 2px solid var(--white);
      color: var(--white);
    }
  }

  &:focus {
    outline: 2px solid var(--blue);
  }
`;
