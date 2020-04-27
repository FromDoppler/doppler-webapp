import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NewFeatures = () => {
  const [campaignId, setCampaignId] = useState(0);
  return (
    <>
      <header className="hero-banner report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h2>Funcionalidades Nuevas</h2>
              <p>
                Features sin acceso para los usuarios todavía y con trabajo pendiente de contenidos
                y diseño.
              </p>
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>
      <section className="dp-container">
        <div className="dp-block-wlp dp-box-shadow">
          <div style={{ marginLeft: '20px' }}>
            <h3>Maestro de Suscriptores</h3>
            <Link to={`/reports/master-subscriber`}>Link</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Campañas parcialmente enviadas</h3>
            <p>
              Como encuentro el id de mi Campaña enviada?{' '}
              <span class="ms-icon icon-tip-icon dp-tooltip-right">
                <span class="tooltiptext">
                  Ir a Campañas -> Enviadas y al acceder al Reporte que se visualiza en la grilla.
                  Se ve en la url similar a
                  https://app2.fromdoppler.com/Campaigns/Reports/Dashboard?idCampaign=10011359 en
                  este caso el id es 10011359
                </span>
              </span>
            </p>
            <p>
              Como encuentro el id de mi Campaña en progreso?{' '}
              <span class="ms-icon icon-tip-icon dp-tooltip-right">
                <span class="tooltiptext">
                  Antes de ponerla a enviar, desde el summary de la Campaña se visualiza en la url,
                  algo similar a esta url
                  https://app2.fromdoppler.com/Campaigns/Summary?IdCampaign=10264783 aqui el id es
                  10264783
                </span>
              </span>
            </p>
            <input
              style={{ width: '400px' }}
              type="text"
              placeholder="Ingresa el id de la Campaña enviada o en progreso"
              onChange={(e) => {
                const { value } = e.target;
                setCampaignId(value);
              }}
            ></input>{' '}
            <Link to={`/reports/partials-campaigns?campaignId=${campaignId}`}>Ir al Reporte</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow">
          <div style={{ marginLeft: '20px' }}>
            <h3>Reportes con lo nuevo de datahub</h3>
            <Link to={`/reports-new`}>Link</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewFeatures;
