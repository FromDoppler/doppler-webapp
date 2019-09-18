import {keyframes} from "styled-components";

/* Spacings for margenes and paddings */
export const spacings = {
  spacesLv0: '0',
  spacesLv1: '6px',
  spacesLv2: '12px',
  spacesLv3: '18px',
  spacesLv4: '24px',
  spacesLv5: '30px',
  spacesLv6: '36px',
  spacesLv7: '42px',
  spacesLv8: '48px',
  spacesLv9: '54px',
  spacesLv10: '60px',
  spacesLv11: '66px',
  spacesLv12: '72px',
  spacesLv13: '78px',
  spacesLv14: '84px',
  spacesLv15: '90px',
  spacesLv16: '96px',
};

/* Font Sizes */
export const fonts = {
  fontStrong: 'bold',
  fontLv0: '10px',
  fontLv1: '11px',
  fontLv2: '12px',
  fontLv3: '13px',
  fontLv4: '14px',
  fontLv5: '15px',
};

/* Colors */
export const colors = {
  softGrey: '#cccccc',
  lightGrey: '#666666',
  darkGrey: '#333333',
  smoothGrey: '#f6f6f6',
  faintGrey: '#eaeaea',
  ghostGrey: '#f2f2f2',
  white: '#ffffff',
  black: '#000000',
  darkYellow: '#fbb100',
  darkPurple: '#b58fc1',
};

/* Animations */

export const slowGrowing = keyframes`
  0% {
    transform: scaleX(0);
  }

  100% {
    transform: scaleX(1);
  }
`;

