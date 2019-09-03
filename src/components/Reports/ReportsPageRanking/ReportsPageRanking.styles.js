import styled from 'styled-components';

export const PageRankingItem = styled.div`
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  background: #f2f2f2;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div {
    padding: 20px 30px;
  }

  a {
    font-size: 13px;
  }
`;

export const PageRankingItemText = styled.p`
  margin: 5px;
  font-size: 13px;
  color: #333;
  transition: all 0.25s ease;
`;

export const PageRankingBreakdown = styled.div`
  background: #fff;
  width: 30%;
  text-align: right;

  p {
    font-size: 13px;
    font-weight: bold;
    margin: 5px;
  }

  .visits--withemail {
    color: #b591c3;
  }

  p.visits--withoutemail {
    margin-top: 15px;
    color: #fbb224;
  }
`;
