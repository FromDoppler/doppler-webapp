import c3 from 'c3';
import React, { useState, useEffect } from 'react';

const C3Chart = ({ config }) => {
  const [chart, setChart] = useState();

  const generateChart = (config) => {
    const build = Object.assign({ bindto: '#c3chart' }, config);
    setChart(c3.generate(build));
  };

  useEffect(() => {
    if (!chart) {
      generateChart(config);
    } else {
      chart.load(config.data);
    }
  }, [config, chart]);

  return <div className="c3-chart" id='c3chart' />;
};

export default C3Chart;
