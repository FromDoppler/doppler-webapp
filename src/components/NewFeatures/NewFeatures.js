import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../doppler-types';

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
            <h3>Editors Demo MFE</h3>
            <Link to={'/editors-demo/campaigns/123'}>Ir a Editors Demo MFE</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewFeatures;
