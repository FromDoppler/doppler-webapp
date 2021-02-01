import styled, { css, keyframes } from 'styled-components';
import { colors } from '../../styles/colors';
import { spacings } from '../../styles/spacings';
import { fonts } from '../../styles/fonts';

const slowGrowing = keyframes`
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(1)
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > div {
    width: 100%;
  }
`;

export const ListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > div:nth-child(odd) {
    background: ${colors.smoothGrey};
    padding: ${spacings.spacesLvl6} ${spacings.spacesLvl5};
  }

  & > div:nth-child(even) {
    padding: ${spacings.spacesLvl6} ${spacings.spacesLvl5};
  }

  & > div:nth-child(n + 4) {
    margin-top: ${spacings.spacesLvl0};
    @media (min-width: 768px) {
      margin-top: ${spacings.spacesLvl2};
    }
  }
`;

export const ListItem = styled.div`
  border-top: 1px solid ${colors.softGrey};
  padding: ${spacings.spacesLvl6} ${spacings.spacesLvl5} ${spacings.spacesLvl7};

  @media (min-width: 768px) {
    border-bottom: 1px solid ${colors.softGrey};
    border-top: 1px solid ${colors.softGrey};
  }
`;

export const ListItemHeader = styled.header`
  display: flex;
  justify-content: space-between;
  font-weight: ${fonts.fontStrong};
  padding-bottom: ${spacings.spacesLvl6};
  color: ${colors.darkGrey};
  line-height: 24px;

  p:before {
    content: '';
    position: absolute;
    height: 2px;
    width: 95px;
    top: 80px;
    left: 30px;
    border: 1px solid ${colors.faintGrey};
  }

  span {
    font-size: ${fonts.fontLvl3};

    span {
      margin-left: ${spacings.spacesLvl1};
    }
  }
`;

export const ListItemDetail = styled.div`
  p,
  span {
    font-weight: ${fonts.fontStrong};
  }

  p {
    font-size: ${fonts.fontLvl1};
    color: ${colors.lightGrey};
    margin: ${spacings.spacesLvl0};
  }

  span {
    color: ${colors.darkGrey};
    font-size: ${fonts.fontLvl3};
  }

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: ${spacings.spacesLvl5};

    & > div {
      width: 70%;
    }

    span span {
      margin-left: ${spacings.spacesLvl1};
    }
  }
`;

export const Bar = styled.div`
  margin-top: ${spacings.spacesLvl1};
  height: 16px;
  transform-origin: left;
  transition: all ease-in-out forwards;
  animation: ${slowGrowing} 7s;
  width: ${({ width }) => (width ? width : '0')};
  background: ${colors.darkYellow};
  ${(props) =>
    props.primary &&
    css`
      background: ${colors.purple3};
    `}
`;
