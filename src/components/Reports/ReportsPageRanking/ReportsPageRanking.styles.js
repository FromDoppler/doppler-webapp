import React from 'react';
import styled from 'styled-components';
import { colors } from '../../styles/colors';
import { spacings } from '../../styles/spacings';
import { fonts } from '../../styles/fonts';

export const ReportBox = ({ children }) => <div className="reports-box">{children}</div>;

export const ContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > div {
    width: 100%;
    padding: 0;
    position: relative;
  }

  .col-sm-12 {
    padding: ${spacings.spacesLvl0};
  }
`;

export const ListItem = styled.div`
  border-top: 1px solid ${colors.softGrey};
  border-bottom: 1px solid ${colors.softGrey};
  background: ${colors.ghostGrey};
  margin-bottom: ${spacings.spacesLvl1};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  p {
    font-size: ${fonts.fontLvl3};
    margin: ${spacings.spacesLvl1};
    color: ${colors.darkGrey};
  }

  a {
    font-size: ${fonts.fontLvl3};
  }

  .col-md-4,
  .col-lg-4 {
    padding: 0;
  }
`;

export const ListItemColumn = styled.div`
  padding: ${spacings.spacesLvl2} ${spacings.spacesLvl0} ${spacings.spacesLvl2}
    ${spacings.spacesLvl3};
`;

export const ListItemRightColumn = styled(ListItemColumn)`
  background: ${colors.white};
  padding: ${spacings.spacesLvl6} ${spacings.spacesLvl5};
  text-align: left;

  @media (min-width: 767px) {
    text-align: right;
  }

  p {
    font-weight: ${fonts.fontStrong};
    margin: ${spacings.spacesLvl0};

    &.visits--withemail {
      color: ${colors.purple3};
    }

    &.visits--withoutemail {
      color: ${colors.darkYellow};
      margin-top: ${spacings.spacesLvl3};
    }
  }
`;

export const GridFooter = styled.div`
  text-align: right;
  padding: ${spacings.spacesLvl2} ${spacings.spacesLvl5} ${spacings.spacesLvl3}
    ${spacings.spacesLvl0};
  font-size: ${fonts.fontLvl3};

  button {
    text-transform: uppercase;
    padding: ${spacings.spacesLvl5} ${spacings.spacesLvl9};
  }

  &::after {
    content: '';
    width: ${spacings.spacesLvl0};
    position: absolute;
    right: ${spacings.spacesLvl6};
    top: 45%;
    height: ${spacings.spacesLvl0};
    border-style: solid;
    border-width: 8px 6px 0 6px;
    border-color: ${colors.lightGrey} transparent transparent transparent;
    margin-left: ${spacings.spacesLvl1};
    display: inline-block;
  }
`;

export const SpinnerContainer = styled.div`
  position: relative;
  height: 150px;

  .loading-box {
    background: none;
  }
`;
