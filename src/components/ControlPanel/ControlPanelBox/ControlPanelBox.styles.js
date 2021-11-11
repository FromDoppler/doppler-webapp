import styled from 'styled-components';

const Link = styled.a`
  display: inline-block;
  padding: 40px 0px;
  text-align: center;
  position: relative;
  height: 200px;
  width: 100%;

  &:hover {
    box-shadow: 0 0 0 4px rgb(105 105 105 / 15%);
  }
`;

const Image = styled.img`
  height: 80px;
  margin: 0 0 16px 0;
`;

const Text = styled.span`
  color: #333;
  display: inline-block;
  font-size: 15px;
  font-weight: normal;
  line-height: 1.2;
  text-decoration: none;
  width: 180px;
`;

const DisabledLink = styled.a`
  display: inline-block;
  padding: 40px 0px;
  text-align: center;
  position: relative;
  pointer-events: none;
  opacity: 0.4;
  height: 200px;
  width: 100%;
`;

const StatusImage = styled.img`
  position: absolute;
  z-index: 1;
  margin: 5px;
`;

export { Link, Image, Text, DisabledLink, StatusImage };
