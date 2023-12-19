import Slider from "react-slick";
import styled from "styled-components";
import PropTypes from "prop-types";

import { LazyImage } from "fragments";

const Slideshow = ({ slides, settings }) => {
  return (
    <StyledSlider {...settings}>
      {slides.map((p) => {
        return (
          <div key={p}>
            <LazyImage src={p.image} alt={`${p.title} - Pet Plushies`} />
          </div>
        );
      })}
    </StyledSlider>
  );
};

Slideshow.propTypes = {
  slides: PropTypes.array,
  settings: PropTypes.object,
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
