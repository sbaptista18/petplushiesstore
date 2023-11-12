import Slider from "react-slick";
import styled from "styled-components";
import PropTypes from "prop-types";

const Slideshow = ({ pictures, settings }) => {
  return (
    <StyledSlider {...settings}>
      {pictures[0]?.map((imageUrl, index) => (
        <div key={index}>
          <img src={imageUrl} alt={" - Pet Plushies"} />
        </div>
      ))}
    </StyledSlider>
  );
};

Slideshow.propTypes = {
  pictures: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired,
};

const StyledSlider = styled(Slider)`
  height: 500px;
  width: 500px;
  overflow: hidden;

  & div {
    height: 100%;

    & img {
      width: 100%;
      height: auto;
    }
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
