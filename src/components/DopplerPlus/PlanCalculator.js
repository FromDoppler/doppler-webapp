import React, { useReducer, useEffect, useState } from 'react';
import { Slider } from '../shared/Slider/Slider';
import { InjectAppServices } from '../../services/pure-di';
import { Loading } from '../Loading/Loading';
import { useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';

const PlanCalculator = ({ dependencies: { dopplerLegacyClient } }) => {
  const { params } = useRouteMatch();
  const { typePlanId, promoId, discountId } = params;
  const safePromoId = promoId || '';
  const safeDiscountId = discountId || 0;
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  const [state, setState] = useState({ loading: true });

  const [currentPlan, setSelectedPlan] = useReducer(
    (currentPlan, index) => {
      return state.planList[index] || currentPlan;
    },
    { idPrice: 0, price: 0, amount: 0 },
  );

  const [currentDiscount, applyDiscount] = useReducer(
    (discount, index) => {
      return state.discountsList[index] || discount;
    },
    { id: 0, percent: 0, monthsAmmount: 0, description: '' },
  );

  useEffect(() => {
    const fetchData = async () => {
      setState({ loading: true });
      const responsePlansList = await dopplerLegacyClient.getPlansList(typePlanId);
      if (responsePlansList.success) {
        setState({
          loading: false,
          planList: responsePlansList.planList,
          discountsList: responsePlansList.discounts,
          success: true,
        });
        setSelectedPlan(0);
        applyDiscount(safeDiscountId);
      } else {
        setState({ success: false });
      }
    };
    fetchData();
  }, [dopplerLegacyClient, typePlanId, safeDiscountId]);

  if (state.loading) {
    return <Loading page />;
  }

  const planUrl =
    _('common.control_panel_section_url') +
    `/AccountPreferences/UpgradeAccountStep2?IdUserTypePlan=${currentPlan.idPlan}&fromStep1=True&IdDiscountPlan=${currentDiscount.id}&PromoCode=${safePromoId}`;

  const plansTooltipDescriptions = state.planList?.map((plan) => {
    return plan.amount + ' Suscriptores';
  });

  return state.success ? (
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
              {state.discountsList.map((discount, index) => (
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
              handleChange={setSelectedPlan}
            />
            <div style={{ marginTop: '40px' }}>
              <a className="dp-button button-medium primary-green" href={planUrl}>
                Contratar
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  ) : (
    <div className="p-t-54 p-b-54" style={{ backgroundColor: '#f6f6f6', flex: '1' }}>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12" style={{ textAlign: 'center' }}>
            <span>Hubo un error al traer los datos</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InjectAppServices(PlanCalculator);
