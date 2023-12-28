import Slider from "react-slick";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { Button } from "components";
import { LazyImage } from "fragments";

import BottomBar from "assets/images/bottom-bar.svg";

const Slideshow = ({ slides, settings }) => {
  return (
    <SlideshowContainer>
      <StyledSlider {...settings}>
        {slides.map((p) => {
          return (
            <div key={p}>
              <Container>
                <LazyImage src={p.image} alt={`${p.title} - Pet Plushies`} />
                <Overlay />
                <Text>
                  <span>{p.title}</span>

                  <Link to={p.url}>
                    <Button size="large" type="primary" text="Saber mais" />
                  </Link>
                </Text>
              </Container>
            </div>
          );
        })}
      </StyledSlider>
      <StyledBottomBar />
    </SlideshowContainer>
  );
};

Slideshow.propTypes = {
  slides: PropTypes.array,
  settings: PropTypes.object,
};

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0%;
  left: 0%;
`;

const SlideshowContainer = styled.div`
  position: relative;
  height: 750px;
`;

const StyledBottomBar = styled(BottomBar)`
  position: absolute;
  bottom: -1px;
  left: 0;
  fill: #fff;
`;

const StyledSlider = styled(Slider)`
  height: 750px;
  overflow: hidden;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 0;

  & div {
    height: 100%;
  }

  & .slick-dots {
    bottom: 5px;

    & li {
      & button {
        &:before {
          font-size: 20px;
          color: var(--white);
        }
      }

      &.slick-active {
        & button {
          &:before {
            color: var(--light-blue);
          }
        }
      }
    }
  }
`;

const Container = styled.div`
  width: unset;
  position: relative;
`;

const Text = styled.span`
  height: auto;
  width: 100%;
  text-align: center;
  color: var(--white);
  position: absolute;
  bottom: 70px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 0;
  font-size: 26px;
  display: flex;
  flex-direction: column;
`;

export default Slideshow;
