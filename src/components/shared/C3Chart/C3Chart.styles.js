import styled from 'styled-components';
import { colors } from '../../styles/colors';
import { spacings } from '../../styles/spacings';

export const C3ChartStyled = styled.div`
  margin: ${spacings.spacesLvl0} ${spacings.spacesLvl4} ${spacings.spacesLvl6};

  svg {
    font: 400 11px 'Proxima-Nova', sans-serif;
    color: ${colors.softGrey};
    width: 100%;
    display: inline-block;
  }

  .tick {
    fill: ${colors.sightGrey};
    font: 400 11px 'Proxima-Nova', sans-serif;
  }

  .domain {
    stroke: ${colors.softGrey};
  }

  path,
  line {
    fill: none;
    stroke: ${colors.softGrey};
  }

  .c3-line {
    stroke-width: 2px;
    position: relative;
    transition: all 0.5s ease-in-out;
  }

  .c3-event-rect {
    stroke-width: 7px;
  }

  .c3-xgrid,
  .c3-ygrid {
    stroke-dasharray: 3 3;
  }

  .c3-xgrid-focus {
    stroke: ${colors.purple3};
    transition: all 1s ease-in-out;
    opacity: 1;
  }

  .c3-circle {
    fill: ${colors.purple3};
    opacity: 1;
  }

  .c3-areas {
    fill: ${colors.darkPurple};
    opacity: 0.3;
  }

  .c3-target-withEmail {
  }

  .c3-target-withoutEmail {
  }

  .c3-tooltip-container {
    background: ${colors.white};
    padding: ${spacings.spacesLvl4} ${spacings.spacesLvl5};
    min-width: 180px;
    color: ${colors.darkGrey};
    font: 400 12px 'Proxima-Nova', sans-serif;
    z-index: 10;
    box-shadow: 0 0 0 4px rgba(204, 204, 204, 0.3);
    border: 1px solid ${colors.softGrey};
    position: relative;
  }

  .c3-tooltip {
    border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    opacity: 0.9;
  }

  .c3-tooltip th,
  .c3-tooltip .tooltip-title {
    font-size: 11px;
    padding: 2px 5px;
    text-align: left;
    color: ${colors.lightGrey};
    font-weight: normal;
    line-height: 13px;
  }

  .c3-tooltip th::first-letter,
  .c3-tooltip .tooltip-title::first-letter {
    text-transform: capitalize;
  }

  .c3-tooltip .name {
    display: none;
  }

  .c3-tooltip td,
  .c3-tooltip .tooltip-value {
    font-size: 13px;
    padding: 3px 6px;
    color: ${colors.darkGrey};
    font-weight: bold;
    width: auto;
    line-height: 16px;
  }

  .c3-target-hide-graph {
    display: none;
  }
`;
