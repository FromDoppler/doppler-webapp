import styled from 'styled-components';

import colors from '../Colors';

export const C3ChartStyled = styled.div`
  display: block;
  width: 97%;
  margin: 20px 0px 20px 12px;

  svg {
    font: 400 11px 'Proxima-Nova', sans-serif;
    color: ${colors.SoftGrey};
  }

  .tick {
    fill: ${colors.LightGrey};
    font: 400 11px 'Proxima-Nova', sans-serif;
  }

  .domain {
    stroke: ${colors.SoftGrey};
  }

  path,
  line {
    fill: none;
    stroke: ${colors.SoftGrey};
  }

  .c3-line {
    stroke-width: 4px;
    position: relative;
    transition: all 2s ease-in-out;
  }

  .c3-event-rect {
    stroke-width: 7px;
  }

  .c3-xgrid,
  .c3-ygrid {
    stroke-dasharray: 3 3;
  }

  .c3-xgrid-focus {
    stroke: ${colors.DarkPurple};
    transition: all 1s ease-in-out;
  }

  .c3-shapes-quantity {
    fill: ${colors.DarkPurple};
  }

  .c3-tooltip-container {
    background: ${colors.White};
    padding: 24px 30px;
    min-width: 180px;
    color: ${colors.DarkGrey};
    font: 400 12px 'Proxima-Nova', sans-serif;
    z-index: 10;
    box-shadow: 0 0 0 4px rgba(204, 204, 204, 0.3);
    border: 1px solid ${colors.SoftGrey};
    position: relative;
  }

  .c3-tooltip {
    border-collapse: collapse;
    border-spacing: 0;
    empty-cells: show;
    opacity: 0.9;
  }

  .c3-tooltip th {
    font-size: 11px;
    padding: 2px 5px;
    text-align: left;
    color: ${colors.LightGrey};
    font-weight: normal;
    line-height: 13px;
  }

  .c3-tooltip .name {
    display: none;
  }

  .c3-tooltip td {
    font-size: 13px;
    padding: 3px 6px;
    color: ${colors.DarkGrey};
    font-weight: bold;
    width: auto;
    line-height: 16px;
  }

  @media (max-width: 768px) {
    .c3-chart {
      width: 95%;
    }
  }
`;
