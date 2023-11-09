
import { useRef } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";
import LazyLoad from "react-lazyload";

const ImageWrapper = styled.div`
  position: relative;
  width: inherit;
  height: inherit;
`;

const loadingAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 0; }
`;

const StyledImage = styled.img`
  opacity: 0;
  transition: opacity 100ms;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Placeholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  animation: ${loadingAnimation} ease-in-out 1s infinite;
  background-size: 33%;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  width: 100% !important;
`;
const StyledLazyLoad = styled(LazyLoad)`
  width: inherit;
  height: inherit;
  margin: auto;
`;

const LazyImage = ({ src, alt }) => {

  const refPlaceholder = useRef();
  const refImg = useRef();

  const removePlaceholder = () => {
    refPlaceholder.current.remove();
    refImg.current.style.opacity = 1;
  };

  return (
    <ImageWrapper>
      <Placeholder ref={refPlaceholder} style={{ backgroundImage: `url(/public/images/logo.svg)` }} />
      <StyledLazyLoad once>
        <StyledImage
          onLoad={removePlaceholder}
          onError={removePlaceholder}
          src={src}
          alt={alt}
          ref={refImg}
        />
      </StyledLazyLoad>
    </ImageWrapper>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

export default LazyImage;