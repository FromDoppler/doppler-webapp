import styled from 'styled-components';
import { colors } from '../styles/colors';
import { fonts } from '../styles/fonts';
import { spacings } from '../styles/spacings';

export const Banner = styled.div`
  border: 2px solid ${colors.faintGrey};
  border-radius: 3px;
  margin-top: ${spacings.spacesLvl11};
  padding: 40px 50px 40px 40px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${colors.white};

  div {
    flex: 2;
  }

  h2 {
    font-size: ${fonts.fontLvl9};
    line-height: 24px;
    padding-bottom: ${spacings.spacesLvl1};
  }

  p {
    font-size: ${fonts.fontLvl4};
  }
`;

export const ImgEnterprise = styled.img`
  height: 45px;
  float: left;
  margin-right: ${spacings.spacesLvl4};
`;
