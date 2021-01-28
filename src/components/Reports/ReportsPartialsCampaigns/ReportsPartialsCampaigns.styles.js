import styled from 'styled-components';
import { colors } from '../../styles/colors';
import { spacings } from '../../styles/spacings';
import { fonts } from '../../styles/fonts';

export const MainReportBox = styled.div`
  margin-bottom: ${spacings.spacesLvl6};

  p {
    color: ${colors.darkGrey};
    display: block;
    font-size: ${fonts.fontLvl8};
    margin-bottom: ${spacings.spacesLvl2};
  }
`;

export const DetailedInformation = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  p {
    color: ${colors.darkGrey};
    position: relative;
    text-transform: uppercase;
    font-size: ${fonts.fontLvl3};
  }

  div {
    padding: ${spacings.spacesLvl0};

    div {
      padding: ${spacings.spacesLvl5};
    }

    h2 {
      font-size: 60px;
      line-height: 60px;
      font-weight: normal;

      @media (max-width: 768px) {
        font-size: 48px;
        line-height: 48px;
      }
    }
  }
`;

export const HeaderBox = styled.header`
  padding: ${spacings.spacesLvl5} ${spacings.spacesLvl8} ${spacings.spacesLvl4};

  h3 {
    font-weight: bold;
  }
`;

export const Kpi = styled.div`
  padding: ${spacings.spacesLvl0} ${spacings.spacesLvl8} ${spacings.spacesLvl8};
  display: flex;
  position: relative;
  flex-direction: column;

  div {
    margin-bottom: ${spacings.spacesLvl3};
  }

  p {
    color: ${colors.darkGrey};
    font-size: ${fonts.fontLvl3};
    text-transform: uppercase;
    margin-top: ${spacings.spacesLvl2};

    &.numbers-title {
      font-size: 45px;
      line-height: 62px;
      position: relative;
      margin: 0;
      @media (max-width: 768px) {
        font-size: 48px;
        line-height: 48px;
      }

      &:before {
        content: '';
        position: absolute;
        width: 140px;
        left: 0;
        bottom: 0;
        border-bottom-style: solid;
        border-bottom-width: 2px;
      }
    }
  }

  div:nth-child(1) {
    p.numbers-title:before {
      border-bottom-color: ${colors.green};
    }
  }

  div:nth-child(2) {
    .numbers-title:before {
      border-bottom-color: ${colors.darkYellow};
    }
  }

  div:nth-child(3) {
    p.numbers-title:before {
      border-bottom-color: ${colors.red};
    }
  }
`;

export const Summary = styled.div`
  padding: ${spacings.spacesLvl0} ${spacings.spacesLvl8} ${spacings.spacesLvl8};

  ul {
    line-height: 2.5em;

    & li:nth-child(even) {
      background: #eee;
    }

    li {
      text-indent: ${spacings.spacesLvl3};
      font-size: ${fonts.fontLvl5};
    }

    span {
      float: right;
      margin-right: ${spacings.spacesLvl3};
      font-weight: bold;
    }
  }
`;

export const BackGrey = styled.div`
  background: ${colors.smoothGrey};
  height: 100%;
`;
