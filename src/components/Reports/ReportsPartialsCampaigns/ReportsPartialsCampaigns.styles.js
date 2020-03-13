import styled from 'styled-components';
import colors from '../../styles/colors';
import spacings from '../../styles/spacings';

export const MainReportBox = styled.div`
  span {
    display: block;
    line-height: 30px;
  }
`;

export const DetailedInformation = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;

  p {
    font-weight: 600;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      height: 2px;
      width: 95px;
      top: 36px;
      left: 0px;
      border: 1px solid ${colors.faintGrey};
    }
  }

  div:nth-child(odd) {
    background: ${colors.smoothGrey};
  }

  div {
    padding: ${spacings.spacesLvl8};
    flex: 0 0 33%;

    @media (max-width: 768px) {
      padding: ${spacings.spacesLvl5} ${spacings.spacesLvl8};
      flex: 0 0 100%;
    }

    h2 {
      font-size: 60px;
      line-height: 60px;
      margin: ${spacings.spacesLvl4} ${spacings.spacesLvl0};

      @media (max-width: 768px) {
        font-size: 48px;
        line-height: 48px;
      }
    }
  }
`;

export const Header = styled.header`
  padding: ${spacings.spacesLvl5} ${spacings.spacesLvl8} ${spacings.spacesLvl5};
  position: relative;

  &:before {
    content: '';
    position: absolute;
    height: 2px;
    width: 95px;
    top: 90px;
    left: 48px;
    border: 1px solid ${colors.faintGrey};
  }

  h3 {
    font-weight: bold;
  }
`;

export const Kpi = styled.div`
  padding: ${spacings.spacesLvl0} ${spacings.spacesLvl8} ${spacings.spacesLvl8};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;

  div {
    flex: 0 0 33%;
    @media (max-width: 375px) {
      flex: 0 0 100%;
    }
  }

  h2 {
    font-size: 60px;
    line-height: 60px;
    position: relative;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 48px;
      line-height: 48px;
    }

    &:before {
      content: '';
      position: absolute;
      width: 90px;
      left: 0;
      bottom: -12px;
    }
  }

  p {
    font-weight: 600;
  }

  div:nth-child(1) {
    h2:before {
      border-bottom: 3px solid ${colors.green};
    }
  }

  div:nth-child(2) {
    h2:before {
      border-bottom: 3px solid ${colors.darkYellow};
    }
  }

  div:nth-child(3) {
    h2:before {
      border-bottom: 3px solid ${colors.red};
    }
  }
`;

export const Summary = styled.div`
  padding: ${spacings.spacesLvl0} ${spacings.spacesLvl8} ${spacings.spacesLvl8};

  ul {
    line-height: 2em;

    li {
      font-weight: 600;
    }

    span {
      color: ${colors.darkGrey};
    }
  }
`;

export const BackGrey = styled.div`
  background: ${colors.smoothGrey};
  height: 100%;
`;
