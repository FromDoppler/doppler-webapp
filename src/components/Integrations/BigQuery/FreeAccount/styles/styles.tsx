import React from 'react';
import { ReactComponent as BigQueryIcon } from './icons/big-query-logo.svg';

const BigQueryLogo = ({
  height = '100',
  width = '100',
  color = 'black',
  ...props
}: React.SVGProps<SVGSVGElement> & { secondaryColor?: string }) => (
  <BigQueryIcon
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    {...props}
  ></BigQueryIcon>
);

export { BigQueryLogo };
