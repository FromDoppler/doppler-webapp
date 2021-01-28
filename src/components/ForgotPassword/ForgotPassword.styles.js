import styled from 'styled-components';
import { colors } from '../styles/colors';
import { bouncedIn } from '../styles/animations';

export const MessageSuccess = styled.div`
  color: ${colors.green};
  border-radius: 3px;
  margin: 36px 0 131px;

  p {
    margin: 0;
  }

  .bounceIn {
    animation-duration: 0.75s;
    animation-name: ${bouncedIn};
  }
`;
