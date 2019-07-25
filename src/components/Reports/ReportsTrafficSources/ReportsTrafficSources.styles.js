import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-flow: wrap;
  div:nth-child(odd) {
    background: #f6f6f6;
  }
  div:nth-child(n+4) {
    margin-top: 10px;
  }
`

export const TrafficSourceContainer = styled.div`
  flex: calc(100% / 3);
  box-shadow: 2px 0 4px 0 rgba(0,0,0,0.2);
  border-bottom: 1px solid #CCC;
  border-top: 1px solid #CCC;
`

export const TrafficSourceHeader = styled.header`
  display: flex;
  justify-content: space-between;
  margin: 40px 30px;
  font-weight: bold;
  color: #333;

  h6 {
    line-height: 1;
    margin: 0;
  }
`