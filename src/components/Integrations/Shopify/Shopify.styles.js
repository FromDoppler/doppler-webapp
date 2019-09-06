import React from 'react';
import styled from 'styled-components';
import logo from './logo.svg';

const ShopifyLogo = ({ className }) => <img className={className} src={logo} alt="Shopify logo" />;

export const StyledShopifyLogo = styled(ShopifyLogo)`
  width: 80px;
  @media only screen and (max-width: 600px) {
    display: none;
  }
`;
