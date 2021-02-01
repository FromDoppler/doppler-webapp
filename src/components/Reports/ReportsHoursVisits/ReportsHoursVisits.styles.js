import styled, { css } from 'styled-components';
import { colors } from '../../styles/colors';
import { spacings } from '../../styles/spacings';
import { fonts } from '../../styles/fonts';

export const WrapperBoxContainer = styled.div`
  .reports-box {
    overflow: visible;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const List = styled.div`
  overflow-x: scroll;
  padding: ${spacings.spacesLvl3} ${spacings.spacesLvl0} ${spacings.spacesLvl2}
    ${spacings.spacesLvl0};
  border-right: 36px solid ${colors.white};
  border-left: 36px solid ${colors.white};
  margin-bottom: ${spacings.spacesLvl6};

  .dp-tooltip-container {
    width: 100%;
    position: relative;
    display: inherit;
    cursor: pointer;
  }

  @media (min-width: 1024px) {
    width: 100%;
    overflow-x: initial;
    border-right: 36px solid ${colors.white};
  }
`;

export const Row = styled.div`
  margin-bottom: ${spacings.spacesLvl3};
  height: 31px;
  display: flex;
  align-items: center;
  position: relative;
  width: 925px;

  @media (min-width: 1024px) {
    width: 100%;
  }

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
  width: 46px;
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
  box-shadow: 0 0 0 30px rgba(255, 255, 255, 0);
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
    box-shadow: 0 0 0 0 rgba(212, 189, 219, 0.6);
  }
`;

export const Legend = styled.div`
  display: flex;
  margin-left: ${spacings.spacesLvl10};
  width: 865px;

  @media (min-width: 1024px) {
    width: calc(100% - 60px);
  }

  span {
    width: 46px;
    margin-right: 46px;
    text-align: center;
    font-size: 9px;
    color: ${colors.lightGrey};
  }
`;

export const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  & > div {
    display: flex;
    align-items: end;
    display: flex;

    div {
      margin-right: ${spacings.spacesLvl4};
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      text-align: center;

      div {
        height: 31px;
        margin: ${spacings.spacesLvl0} auto;
      }
    }
  }

  & > .dp-reference {
    margin-left: ${spacings.spacesLvl5};
    justify-content: flex-start;
    margin-bottom: ${spacings.spacesLvl5};
  }

  @media (min-width: 768px) {
    & > .dp-reference {
      justify-content: flex-end;
      margin-left: ${spacings.spacesLvl0};
      margin-bottom: ${spacings.spacesLvl0};
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
    display: block;
    line-height: 18px;

    span {
      margin: ${spacings.spacesLvl0} ${spacings.spacesLvl0} ${spacings.spacesLvl1};
      font-size: ${fonts.fontLvl1};
      font-weight: normal;
      color: ${colors.lightGrey};
      text-transform: capitalize;
    }
  }

  span {
    font-size: ${fonts.fontLvl3};
    color: ${colors.darkGrey};
    font-weight: bold;
  }
`;
