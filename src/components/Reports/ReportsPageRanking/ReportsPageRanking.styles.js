import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/styles';

export const ReportBox = ({ children }) => <div className="reports-box">{children}</div>;

export const ListItem = styled.div`
  border-top: 1px solid ${colors.softGrey};
  border-bottom: 1px solid ${colors.softGrey};
  background: ${colors.ghostGrey};
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 13px;
    margin: '5px';
    color: ${colors.darkGrey};
  }

  a {
    font-size: 13px;
  }
`;

export const ListItemColumn = styled.div`
  padding: 20px 30px;
`;

export const ListItemRightColumn = styled(ListItemColumn)`
  background: ${colors.white};
  width: 30%;
  text-align: right;

  p {
    font-weight: bold;
    &.visits--withemail {
      color: ${colors.darkPurple};
    }
    &.visits--withoutemail {
      color: ${colors.darkYellow};
      margin-top: 15px;
    }
  }
`;
