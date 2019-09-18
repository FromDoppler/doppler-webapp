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
  }
  p {
    display: inline-block;
    font-size: 9px;
    color: ${colors.lightGrey};
    text-transform: uppercase;
    width: 25px;
    text-align: right;
    margin-right: 12px;
  }
`;

export const Column = styled.div`
  display: inline-block;
  width: 31px;
  vertical-align: middle;
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
