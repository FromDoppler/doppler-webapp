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
    font-style: normal;
  }

  li.field-item:has([name="accept_privacy_policies"]) {
    margin-bottom: 0;
  }

  li.field-item:has([name="password"]) {
    margin-bottom: ${spacings.spacesLvl4};
  }
`;
