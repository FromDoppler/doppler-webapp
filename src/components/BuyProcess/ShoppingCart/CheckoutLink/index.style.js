import styled from 'styled-components';

export const CheckoutLinkStyled = styled.a`
  width: 100%;
  font-weight: 400;

  &.disabled {
    pointer-events: none;
    opacity: 0.4;
  }
`;
