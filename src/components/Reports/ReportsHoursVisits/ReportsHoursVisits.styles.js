import styled, { css } from 'styled-components';
import colors from '../../styles/colors';
import spacings from '../../styles/spacings';
import fonts from '../../styles/fonts';

export const List = styled.div`
  padding: ${spacings.spacesLvl3} ${spacings.spacesLvl6} ${spacings.spacesLvl5};
`;

export const Row = styled.div`
  margin-bottom: ${spacings.spacesLvl3};
  height: 31px;
  display: flex;
  align-items: center;
  position: relative;

  .weekday {
    width: 40px;
    margin-right: ${spacings.spacesLvl3};
    display: flex;
    background: ${colors.white};
    z-index: 1;

    p {
      font-size: 9px;
      color: ${colors.lightGrey};
      text-transform: uppercase;
    }
  }

  &:before {
    content: '';
    border-top: 2px dashed ${colors.softGrey};
    width: 100%;
    top: 14px;
    position: absolute;
  }
`;

export const Column = styled.div`
  width: 31px;
  height: 31px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Circle = styled.span`
  display: inline-block;
  position: relative;
  border-radius: 100%;
  width: 11px;
  height: 11px;
  background-color: ${colors.purple1};
  box-shadow: 0px 0px 0px 30px rgba(255, 255, 255, 0);
  transition: box-shadow 0.4s;

  ${(props) =>
    props.medium &&
    css`
      background-color: ${colors.purple2};
      width: 21px;
      height: 21px;
    `}
  ${(props) =>
    props.big &&
    css`
      background-color: ${colors.purple3};
      width: 31px;
      height: 31px;
    `}

   &:hover {
    box-shadow: 0px 0px 0px 0px rgba(212, 189, 219, 0.6);
  }
`;

export const Legend = styled.div`
  display: flex;
  width: 743px;
  margin-left: 56px;

  span {
    width: 31px;
    margin-right: 31px;
    text-align: center;
    font-size: 9px;
    color: ${colors.lightGrey};
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;

  & > div {
    display: flex;
    align-items: end;
    margin: ${spacings.spacesLvl4} ${spacings.spacesLvl0};
    display: flex;

    div {
      margin-right: ${spacings.spacesLvl4};
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      div {
        height: 31px;
        margin: ${spacings.spacesLvl0} auto;
      }
    }
  }

  p {
    font-size: ${fonts.fontLvl1};
    margin: ${spacings.spacesLvl0};
  }
`;

export const Tooltip = styled.div`
  p {
    margin: ${spacings.spacesLvl0};
    span {
      margin: ${spacings.spacesLvl0} ${spacings.spacesLvl0} ${spacings.spacesLvl1};
      font-size: ${fonts.fontLvl1};
      font-weight: normal;
      color: ${colors.lightGrey};
    }
    display: block;
    line-height: 18px;
  }

  span {
    font-size: ${fonts.fontLvl3};
    color: ${colors.darkGrey};
    font-weight: bold;
  }
`;
