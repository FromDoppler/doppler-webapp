import React, { useReducer } from 'react';
import { Slider } from '../shared/Slider/Slider';

const PlanCalculator = () => {
  // TODO: get data from a double service
  const plansList = [
    { idPlan: 1, price: 15, amount: 1500 },
    { idPlan: 2, price: 29, amount: 2500 },
    { idPlan: 3, price: 48, amount: 5000 },
    { idPlan: 4, price: 77, amount: 10000 },
    { idPlan: 5, price: 106, amount: 15000 },
    { idPlan: 6, price: 145, amount: 25000 },
    { idPlan: 7, price: 240, amount: 50000 },
    { idPlan: 9, price: 340, amount: 75000 },
    { idPlan: 9, price: 460, amount: 100000 },
  ];

  const discountsList = [
    { id: 1, percent: 0, monthsAmmount: 1, description: 'Mensual' },
    { id: 2, percent: 5, monthsAmmount: 3, description: 'Trimestral' },
    { id: 3, percent: 15, monthsAmmount: 6, description: 'Semestral' },
    { id: 4, percent: 25, monthsAmmount: 12, description: 'Anual' },
  ];

  const plansTooltipDescriptions = plansList.map((plan) => {
    return plan.amount + ' Suscriptores';
  });

  const initialPlan = plansList[0];

  const [currentPlan, updateSelectedPlan] = useReducer((currentPlan, index) => {
    return plansList[index] || currentPlan;
  }, initialPlan);

  const [currentDiscount, applyDiscount] = useReducer((discount, index) => {
    return discountsList[index] || discount;
  }, discountsList[0]);

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
            <div style={{ marginBottom: '40px' }}>
              {discountsList.map((discount, index) => (
                <button
                  key={index}
                  style={{
                    padding: '10px',
                    border: '1px solid #000',
                    backgroundColor: discount.id === currentDiscount.id ? '#33ad73' : '#f6f6f6',
                  }}
                  onClick={() => {
                    applyDiscount(index);
                  }}
                >
                  {discount.description}
                </button>
              ))}
            </div>
            {currentDiscount.percent ? (
              <p style={{ textDecoration: 'line-through' }}>
                US${currentPlan.price * currentDiscount.monthsAmmount}
              </p>
            ) : (
              <></>
            )}
            <span>US$</span>
            <span style={{ fontSize: '40px' }}>
              {Math.round(
                currentPlan.price *
                  (1 - currentDiscount.percent / 100) *
                  currentDiscount.monthsAmmount,
              )}
            </span>
            <p>{currentDiscount.description}</p>
            <Slider
              tooltipDescriptions={plansTooltipDescriptions}
              defaultValue={0}
              handleChange={updateSelectedPlan}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlanCalculator;
