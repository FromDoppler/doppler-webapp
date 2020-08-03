import React, { useState } from 'react';
import { Slider } from '../shared/Slider/Slider';

const PlanCalculator = () => {
  // TODO: get data from a double service
  const [state, setState] = useState({ price: 15 });
  const valuesPerRange = [15, 29, 48, 77, 106, 145, 240, 340, 460];

  const updatePrice = (index) => {
    setState({
      price: valuesPerRange[index],
    });
  };

  return (
    <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            {/* TODO: change this to intl elemnt */}
            <h1>Plan STANDARD</h1>
            <p style={{ paddingBottom: '50px' }}>
              {/* TODO: change this to intl elemnt */}
              ¿Cuántos contactos tienes? Utiliza el slider para calcular el costo final de tu Plan
            </p>
            <span>US$</span>
            <span style={{ fontSize: '40px' }}>{state.price}</span>
            <p>por mes</p>
            <Slider min={0} max={8} step={1} defaultValue={0} handleChange={updatePrice} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlanCalculator;
