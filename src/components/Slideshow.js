import Slider from "react-slick";
import styled from "styled-components";
import PropTypes from "prop-types";

import { LazyImage } from "fragments";

const Slideshow = ({ pictures, settings }) => {
  return (
    <StyledSlider {...settings}>
      {pictures.map((p) => {
        return (
          <div key={p}>
            <LazyImage src={p} alt={" - Pet Plushies"} />
          </div>
        );
      })}
    </StyledSlider>
  );
};

Slideshow.propTypes = {
  pictures: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
};

const StyledSlider = styled(Slider)`
  height: 800px;
  overflow: hidden;

  & div {
    height: 100%;
  }

  & .slick-dots {
    bottom: 5px;

    & li {
      & button {
        &:before {
          font-size: 20px;
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
