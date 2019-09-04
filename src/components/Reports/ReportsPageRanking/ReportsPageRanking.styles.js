import React from 'react';
import styled from 'styled-components';

export const ReportBox = ({ children }) => <div className="reports-box">{children}</div>;

export const PageListItem = styled.div`
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: #f2f2f2;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: 13px;
    margin: '5px';
    color: '#333';
  }

  a {
    font-size: 13px;
  }
`;

export const PageListItemColumn = styled.div`
  padding: 20px 30px;
`;

export const PageListItemRightColumn = styled(PageListItemColumn)`
  background: #fff;
  width: 30%;
  text-align: right;

  p {
    font-weight: bold;
    &.visits--withemail {
      color: #b591c3;
    }
    &.visits--withoutemail {
      color: #fbb100;
      margin-top: 15px;
    }
  }
`;
