import styled, { css } from 'styled-components';
import colors from '../../styles/colors';

export const Dash = styled.span`
  font-size: 16px;
  color: #d4bddb;
`;

export const List = styled.div`
  padding: 0 30px 12px;
`;

export const Row = styled.div`
  margin-bottom: 18px;
  height: 31px;
  .weekday {
    width: 65px;
    display: inline-block;
    p {
      display: inline-block;
      font-size: 9px;
      color: ${colors.lightGrey};
      text-transform: uppercase;
      width: 25px;
      text-align: right;
      margin-right: 12px;
    }
  }
`;

export const Column = styled.div`
  display: inline-block;
  width: 31px;
  vertical-align: middle;
  position: relative;
  &:hover div {
    display: block;
  }
`;

export const Circle = styled.span`
  display: inline-block;
  border-radius: 100%;
  width: 11px;
  height: 11px;
  background-color: #d4bddb;
  ${(props) =>
    props.medium &&
    css`
      background-color: #bc9ac7;
      width: 21px;
      height: 21px;
    `}
  ${(props) =>
    props.big &&
    css`
      background-color: #9b7ba6;
      width: 31px;
      height: 31px;
    `}
`;

export const Legend = styled.div`
  margin: 0 30px 18px 65px;
  display: flex;
  div {
    text-indent: 6px;
    width: 62px;
    font-size: 9px;
    color: ${colors.lightGrey};
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  & > div {
    display: flex;
    align-items: baseline;
    margin: 18px 30px;
    div {
      margin-right: 6px;
    }
  }
  p {
    font-size: 11px;
  }
`;

export const Tooltip = styled.div`
  background: ${colors.white};
  border-radius: 3px;
  border: 1px solid ${colors.softGrey};
  display: none;
  position: absolute;
  padding: 20px;
  z-index: 1;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  p {
    margin-bottom: 6px;
    margin-top: 0;
    font-size: 11px;
    color: ${colors.lightGrey};
  }
  strong {
    font-size: 13px;
    color: ${colors.darkGrey};
  }
  span {
    margin-left: 3px;
  }
`;
