import React from 'react';

import { InjectAppServices } from '../../services/pure-di';

export const Dashboard = InjectAppServices(({ dependencies: { experimentalFeatures } }) => {
  const isDashboardEnabled = experimentalFeatures && experimentalFeatures.getFeature('Dashboard');

  return (
    <div className="dashboard">
      {isDashboardEnabled && (
        <header className="hero-banner">
          <div className="dp-container">
            <div className="dp-rowflex">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <h2>¡Bienvenido Santiago!</h2>
              </div>
              <div className="col-sm-12">
                <p>
                  Este es tu <b>Tablero de Inicio</b>. Echa un vistazo a tus estadísticas de
                  rendimiento y consejos personalizados.
                </p>
              </div>
            </div>
            <span className="arrow"></span>
          </div>
        </header>
      )}
    </div>
  );
});

export default Dashboard;
