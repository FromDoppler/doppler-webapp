import React from 'react';
import styled from 'styled-components';
import colors from '../../shared/Colors';

export const ReportBox = ({ children }) => <div className="reports-box">{children}</div>;

export const ListItem = styled.div`
  border-top: 1px solid ${colors.SoftGrey};
  border-bottom: 1px solid ${colors.SoftGrey};
  background: ${colors.GhostGrey};
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 13px;
    margin: '5px';
    color: ${colors.DarkGrey};
  }

  a {
    font-size: 13px;
  }
`;

export const ListItemColumn = styled.div`
  padding: 20px 30px;
`;

export const ListItemRightColumn = styled(ListItemColumn)`
  background: ${colors.White};
  width: 30%;
  text-align: right;

  p {
    font-weight: bold;
    &.visits--withemail {
      color: ${colors.DarkPurple};
    }
    &.visits--withoutemail {
      color: ${colors.DarkYellow};
      margin-top: 15px;
    }
  }
`;
