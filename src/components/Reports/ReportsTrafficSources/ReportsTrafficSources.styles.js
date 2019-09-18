import styled, { css, keyframes } from 'styled-components';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import spacings from '../../styles/spacings';

const progressBar = keyframes`
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(1);
  }
`;

export const ListContainer = styled.div`
  display: flex;
  flex-flow: wrap;
  & > div:nth-child(odd) {
    background: ${colors.smoothGrey};
  }
  & > div:nth-child(n + 4) {
    margin-top: ${spacings.spacesLv2};
  }
`;

export const ListItem = styled.div`
  flex: calc(100% / 3);
  box-shadow: 2px 0 4px 0 rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid ${colors.softGrey};
  border-top: 1px solid ${colors.softGrey};
  padding: ${spacings.spacesLv6} ${spacings.spacesLv5} ${spacings.spacesLv7};
`;

export const ListItemHeader = styled.header`
  display: flex;
  justify-content: space-between;
  font-weight: ${fonts.fontStrong};
  padding-bottom: ${spacings.spacesLv6};
  color: ${colors.darkGrey};

  h6 {
    line-height: 1;
    margin: ${spacings.spacesLv0};
    position: relative;
    font-weight: ${fonts.fontStrong};
  }

  h6:before {
    content: '';
    position: absolute;
    height: 2px;
    width: 95px;
    top: 30px;
    left: 0;
    border: 1px solid ${colors.faintGrey};
  }

  span {
    font-size: ${fonts.fontLv3};
  }

  span span {
    margin-left: ${spacings.spacesLv1};
  }
`;

export const ListItemDetail = styled.div`
  p,
  span {
    font-weight: ${fonts.fontStrong};
  }
  p {
    font-size: ${fonts.fontLv1};
    color: ${colors.lightGrey};
    margin: ${spacings.spacesLv0};
  }
  span {
    color: ${colors.darkGrey};
    font-size: ${fonts.fontLv3};
  }
  & > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: ${spacings.spacesLv5};
    & > div {
      width: 70%;
    }

    span span {
      margin-left: ${spacings.spacesLv1};
    }
  }
`;

export const Bar = styled.div`
  margin-top: ${spacings.spacesLv1};
  height: 16px;
  transform-origin: left;
  transition: all ease-in-out forwards;
  animation: ${progressBar} 7s;
  width: ${({ width }) => (width ? width : '0')};
  background: ${colors.darkYellow};
  ${(props) =>
    props.primary &&
    css`
      background: ${colors.darkPurple};
    `}
`;
