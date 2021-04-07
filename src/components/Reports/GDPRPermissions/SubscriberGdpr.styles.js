import styled from 'styled-components';
import { fonts } from '../../styles/fonts';

const TextColumn = styled.span`
  p {
    font-size: ${fonts.fontLvl3};
  }
`;

const EmptyBox = styled.div`
  padding: 48px;
  width: 100%;
`;

export { TextColumn, EmptyBox };
