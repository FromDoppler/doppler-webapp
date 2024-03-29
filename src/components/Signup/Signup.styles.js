import styled from 'styled-components';
import { fonts } from '../styles/fonts';
import { spacings } from '../styles/spacings';

export const MainPanel = styled.article`
  .label--policy p {
    display: inline;
    font-size: ${fonts.fontLvl3};
  }

  ul#legal-accordion {
    margin-top: ${spacings.spacesLvl0};
    margin-bottom: ${spacings.spacesLvl0};

    .dp-accordion-panel {
      padding-top: ${spacings.spacesLvl2};

      a {
        display: inline;
      }
    }

    span.dp-accordion-thumb {
      font-weight: normal;
    }
  }

  #content-subtitle {
    margin-top: ${spacings.spacesLvl4};
    font-style: normal;
  }
`;
