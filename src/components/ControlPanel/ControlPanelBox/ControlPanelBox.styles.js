import styled from 'styled-components';

const Link = styled.a`
  display: inline-block;
  padding: 40px 0px;
  text-align: center;
  position: relative;
`;

const Image = styled.img`
  height: 80px;
  margin: 0 0 16px 0;
  width: 100px;
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
`;

export { Link, Image, Text, DisabledLink };
