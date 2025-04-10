import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../doppler-types';

const NewFeatures = () => {
  const canBuyOnSitePlan = process.env.REACT_APP_DOPPLER_CAN_BUY_ONSITE_PLAN === 'true';
  const canBuyPushNotificationPlan =
    process.env.REACT_APP_DOPPLER_CAN_BUY_PUSHNOTIFICATION_PLAN === 'true';

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
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Dashboard</h3>
            <Link to={'/dashboard'}>Ir a Dashboard</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Maestro de Suscriptores</h3>
            <Link to={`/reports/master-subscriber`}>Link</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Calculadora de planes</h3>
            <Link to={`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`}>
              Ir a calculadora de planes
            </Link>
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
            <h3>Formulario de Agencias</h3>
            <Link to={'/email-marketing-for-agencies'}>Ir a Formulario de Agencias</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div className="m-l-24">
            <h3>Facturas Emitidas</h3>
            <Link to={'/billing/invoices'}>Ir a Facturas Emitidas</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div className="m-l-24">
            <h3>Formulario de caracteristicas exclusivas</h3>
            <Link to={'/email-marketing-exclusive'}>
              Ir al Formulario de caracteristicas exclusivas
            </Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div className="m-l-24">
            <h3>Ventana de bigquery</h3>
            <Link to={'/integrations/big-query'}>Ir al ventana de bigquery.</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
          <div className="m-l-24">
            <h3>Política de Contacto</h3>
            <Link to={'/sending-preferences/contact-policy'}>Ir a Política de Contacto</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
          <div className="m-l-24">
            <h3>tipos de planes</h3>
            <Link to={'/plan-types'}>Ir a tipos de planes</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
          <div className="m-l-24">
            <h3>Editors Demo MFE</h3>
            <Link to={'/editors-demo/campaigns/123'}>Ir a Editors Demo MFE</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
          <div className="m-l-24">
            <h3>Paquetes de landings</h3>
            <Link to={'/landing-packages'}>Ir a Paquetes de landings</Link>
          </div>
        </div>
        {canBuyOnSitePlan && (
          <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
            <div className="m-l-24">
              <h3>Planes de on-site</h3>
              <Link to={'/buy-onsite-plans?buyType=4'}>Ir a Compra de planes de on-site</Link>
            </div>
          </div>
        )}
        {canBuyOnSitePlan && (
          <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
            <div className="m-l-24">
              <h3>Página promocional de on-site</h3>
              <Link to={'/onsite'}>Ir a Página promocional de on-site</Link>
            </div>
          </div>
        )}
        {canBuyPushNotificationPlan && (
          <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
            <div className="m-l-24">
              <h3>Página promocional de notificaciones push</h3>
              <Link to={'/push-notifications'}>Ir a Página promocional de notificaciones push</Link>
            </div>
          </div>
        )}
        {canBuyPushNotificationPlan && (
          <div className="dp-block-wlp dp-box-shadow m-t-36 m-b-36">
            <div className="m-l-24">
              <h3>Planes de notificaciones push</h3>
              <Link to={'/buy-push-notification-plans?buyType=5'}>
                Ir a Compra de planes de notificaciones push
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default NewFeatures;
