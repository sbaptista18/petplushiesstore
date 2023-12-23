import styled from "styled-components";
import { Button, Spin } from "antd";
import PropTypes from "prop-types";

const Btn = ({ size, type, color, text, disabled, loading, ...rest }) => {
  return (
    <StyledButton
      disabled={disabled}
      size={size}
      type={type}
      className={color}
      // loading={loading}
      {...rest}
    >
      {loading ? <Spin /> : <span>{text}</span>}
    </StyledButton>
  );
};

Btn.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string.isRequired,
  color: PropTypes.string,
  text: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

const StyledButton = styled(Button)`
  border-radius: 31px;
  font-family: "Sniglet";
  padding: 10px 25px;
  border: none;
  box-shadow: none;
  transition: 0.25s;
  cursor: pointer;

  & > span {
    text-transform: capitalize;
  }

  &.ant-btn-lg {
    font-size: 14px;
    font-weight: 500;
    height: unset;
    background-color: var(--light-blue);
    color: var(--black);
  }

  &.ant-btn-primary {
    &.white {
      background-color: var(--white);
      color: var(--black);
    }

    &:hover {
      transform: scale(1.1);
    }

    &:active {
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

    &:active {
      border: 2px solid var(--white);
      color: var(--white);
    }
  }

  &:focus {
    outline: 2px solid var(--blue);
  }
`;

export default Btn;
