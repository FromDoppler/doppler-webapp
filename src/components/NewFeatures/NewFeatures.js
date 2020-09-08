import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';

const NewFeatures = () => {
  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <h2>Funcionalidades Nuevas</h2>
          <p>
            Features sin acceso para los usuarios todavía y con trabajo pendiente de contenidos y
            diseño.
          </p>
        </div>
      </HeaderSection>
      <section className="dp-container">
        <div className="dp-block-wlp dp-box-shadow">
          <div style={{ marginLeft: '20px' }}>
            <h3>Maestro de Suscriptores</h3>
            <Link to={`/reports/master-subscriber`}>Link</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Página offline</h3>
            <Link to={'/offline'}>Ir a página offline</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Push Notifications</h3>
            <Link to={'/push'}>Ir a push notifications</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Compra de planes</h3>
            <Link to={'/plan-selection?advanced-pay=year&promo-code=ALLPLANS&planId=18'}>
              Ir a Comprar Plan
            </Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Plan Calculator</h3>
            <Link
              to={
                '/plan-selection/standard-subscribers?selected-plan=18&advanced-pay=year&promo-code=ALLPLANS'
              }
            >
              Ir a calculadora de planes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewFeatures;
