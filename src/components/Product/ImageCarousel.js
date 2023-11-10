import Slider from "react-slick";
import styled from "styled-components";
import PropTypes from "prop-types";

import { LazyImage } from "fragments";

import Image1 from "assets/images/batcat-1.jpg";

const Slideshow = ({ settings }) => {
  return (
    <StyledSlider {...settings}>
      <div>
        <LazyImage src={Image1} alt={" - Pet Plushies"} />
      </div>
      <div>
        <LazyImage src={Image1} alt={" - Pet Plushies"} />
      </div>
      <div>
        <LazyImage src={Image1} alt={" - Pet Plushies"} />
      </div>
      <div>
        <LazyImage src={Image1} alt={" - Pet Plushies"} />
      </div>
      <div>
        <LazyImage src={Image1} alt={" - Pet Plushies"} />
      </div>
      <div>
        <LazyImage src={Image1} alt={" - Pet Plushies"} />
      </div>
    </StyledSlider>
  );
};

Slideshow.propTypes = {
  settings: PropTypes.object.isRequired,
};

const StyledSlider = styled(Slider)`
  height: 500px;
  width: 500px;
  overflow: hidden;

  & div {
    height: 100%;
  }

  & .slick-dots {
    bottom: 5px;

    & li {
      & button {
        &:before {
          font-size: 10px;
          color: white;
        }
      }

      &.slick-active {
        & button {
          &:before {
            color: green;
          }
        }
      }
    }
  }
`;

export default Slideshow;
