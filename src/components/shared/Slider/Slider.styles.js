import styled from 'styled-components';

export const SliderTooltip = styled.div`
  position: absolute;
  line-height: 20px;
  text-align: center;
  border-radius: 3px;
  background: #33ad73;
  color: #fff;
  padding: 5px;
  min-width: 145px;
  margin-top: 65px;
  left: ${(props) => {
    return `calc(${props.dataProgress}% - 60px)`;
  }};
`;
