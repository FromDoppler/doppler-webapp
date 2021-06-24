import styled from 'styled-components';

export const PlanTabContainer = styled.section`
  .tab--content {
    opacity: 0;
    height: auto;

    &.active {
      opacity: 1;
      transition: opacity 1s ease-in-out;
    }
  }
`;
