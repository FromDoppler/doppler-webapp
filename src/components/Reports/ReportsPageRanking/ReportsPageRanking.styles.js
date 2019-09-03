import styled from 'styled-components';

export const StyledPageRankingItem = styled.div`
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

  .page-ranking--breakdown {
    background: #fff;
    width: 30%;
    text-align: right;

    p {
      font-weight: bold;
    }
  }
`;

export const StyledParagraph = styled.p`
  font-size: 13px;
  margin: ${({ margin }) => (margin ? margin : '5px')};
  color: ${({ color }) => (color ? color : '#333')};
`;
