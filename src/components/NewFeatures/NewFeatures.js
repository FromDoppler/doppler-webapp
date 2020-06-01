import React from 'react';
import { Link } from 'react-router-dom';

const NewFeatures = () => {
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
            <h3>Página offline</h3>
            <Link to={'/offline'}>Ir a página offline</Link>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Reportes con lo viejo de datahub</h3>
            <Link to={`/reports-old`}>Link</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewFeatures;
