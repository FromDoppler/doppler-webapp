import './SVGPathElement.patch';
import c3 from 'c3';
import React, { useEffect, useRef } from 'react';
import './C3Chart.css';

const C3Chart = ({ config, dataOptions, data }) => {
  const chartEl = useRef(null);
  const chart = useRef(null);

  useEffect(() => {
    const build = { ...config, data: dataOptions, bindto: chartEl.current };
    chart.current = c3.generate(build);
    return () => {
      chart.current = chart.current.destroy();
    };
  }, [config, dataOptions]);

  useEffect(() => {
    if (data) {
      chart.current.load(data);
    }

    return () => {
      if (chart.current) {
        chart.current.unload();
      }
    };
  }, [data]);

  return <div ref={chartEl} className="c3-chart" />;
};

export default C3Chart;
