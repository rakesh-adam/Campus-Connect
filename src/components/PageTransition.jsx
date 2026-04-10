import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTimePage = location.pathname === "/time";

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <TransitionContainer>
      {isTransitioning && isTimePage ? (
        <TimePageOverlay />
      ) : isTransitioning ? (
        <PageOpeningOverlay />
      ) : null}
      <ContentWrapper isTransitioning={isTransitioning} isTimePage={isTimePage}>
        {children}
      </ContentWrapper>
    </TransitionContainer>
  );
};

const TransitionContainer = styled.div`
  position: relative;
  width: 100%;
`;

const PageOpeningOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 50%;
  width: 100%;
  height: 100vh;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.3),
    rgba(26, 26, 46, 0.9),
    rgba(0, 212, 255, 0.3)
  );
  transform: translateX(-50%);
  z-index: 9999;
  pointer-events: none;
  animation: paperOpen 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  box-shadow: inset 0 0 50px rgba(0, 212, 255, 0.4);

  @keyframes paperOpen {
    0% {
      clip-path: polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%);
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
      opacity: 0;
    }
  }
`;

const TimePageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  background: #1a1a2e;
  animation: timePageReveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  box-shadow: 0 -50px 100px rgba(0, 212, 255, 0.3) inset;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(0, 212, 255, 0.5),
      transparent,
      rgba(0, 212, 255, 0.5)
    );
    animation: lightSweep 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 212, 255, 0.15),
      rgba(0, 212, 255, 0.15) 2px,
      transparent 2px,
      transparent 4px
    );
    animation: scanlines 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    z-index: 3;
  }

  @keyframes timePageReveal {
    0% {
      opacity: 1;
      transform: scaleY(1);
    }
    100% {
      opacity: 0;
      transform: scaleY(0);
    }
  }

  @keyframes lightSweep {
    0% {
      left: -100%;
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 0;
    }
  }

  @keyframes scanlines {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const ContentWrapper = styled.div`
  opacity: ${(props) => (props.isTransitioning ? (props.isTimePage ? 0.3 : 0.8) : 1)};
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: ${(props) => (props.isTransitioning ? "blur(3px)" : "blur(0px)")};
  transform: ${(props) =>
    props.isTransitioning && props.isTimePage
      ? "perspective(1200px) rotateX(15deg) scale(0.9) translateZ(-100px)"
      : "perspective(1200px) rotateX(0deg) scale(1) translateZ(0px)"};
  transform-origin: center top;
`;

export default PageTransition;
