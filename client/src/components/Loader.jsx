import React, { useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from './AuthContext';

const Loader = () => {
  const { userData } = useContext(AuthContext);
  const isDark = userData.mode === 'dark';

  return (
    <StyledWrapper $isDark={isDark}>
      <div className="spinner">
        <div className="loader l1" />
        <div className="loader l2" />
      </div>
      {/* <div className="text-center mt-4">Loading...</div> */}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  position: relative;
  background-color: ${({ $isDark }) => ($isDark ? '#1e1e2f' : '#ffffff')};
  color: ${({ $isDark }) => ($isDark ? '#f0f0f0' : '#333333')};

  .spinner {
    border: 0 solid transparent;
    border-radius: 50%;
    width: 50px;
    height: 50px;
  }

  .loader {
    width: inherit;
    height: inherit;
    position: absolute;
    left: 48%;
  }

  .loader::before,
  .loader::after {
    content: '';
    border: 3px solid ${({ $isDark }) => ($isDark ? '#ccc' : '#505065')};
    border-radius: 50%;
    width: inherit;
    height: inherit;
    position: absolute;
    opacity: 1;
  }

  .l1::before,
  .l1::after {
    animation: clockwiseZ 2.5s infinite;
  }

  .l2::after,
  .l2::before {
    animation: anticlockwiseZ 2.5s infinite;
  }

  @keyframes clockwiseZ {
    0%, 100% {
      transform: rotateY(0);
    }
    50% {
      transform: rotateY(180deg) skew(-10deg, -5deg);
    }
  }

  @keyframes anticlockwiseZ {
    0%, 100% {
      transform: rotateX(0);
    }
    50% {
      transform: rotateX(-180deg) skew(10deg, 5deg);
    }
  }
`;

export default Loader;