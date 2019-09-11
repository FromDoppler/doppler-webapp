import styled, { css } from 'styled-components';
import colors from '../../styles/colors';

export const ListContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  & > div:nth-child(odd) {
    background: ${colors.smoothGrey};
  }
  & > div:nth-child(n + 4) {
    margin-top: 10px;
  }
`;

export const ListItem = styled.div`
  flex: calc(100% / 3);
  box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid ${colors.softGrey};
  border-top: 1px solid ${colors.softGrey};
  padding: 40px 30px;
`;

export const ListItemHeader = styled.header`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding-bottom: 50px;
  color: ${colors.darkGrey};

  h6 {
    line-height: 1;
    margin: 0;
  }
`;

export const ListItemDetail = styled.div`
  p,
  span {
    font-weight: bold;
  }
  p {
    font-size: 11px;
    color: ${colors.lightGrey};
    margin: 0;
  }
  span {
    color: ${colors.darkGrey};
    font-size: 13px;
  }
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 15px;
    & > div {
      width: 70%;
    }
  }
`;

export const Bar = styled.div`
  margin-top: 5px;
  height: 10px;
  width: ${({ width }) => (width ? width : '0')};
  background: ${colors.darkYellow};
  ${(props) =>
    props.primary &&
    css`
      background: ${colors.darkPurple};
    `}
`;
