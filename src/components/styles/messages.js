import styled, { css } from 'styled-components';
import { spacings } from '../styles/spacings';

export const BoxMessage = styled.div`
  margin: ${spacings.spacesLvl5};
  ${(props) =>
    props.spaceTopBottom &&
    css`
      margin: ${spacings.spacesLvl5} 0;
    `}
`;
