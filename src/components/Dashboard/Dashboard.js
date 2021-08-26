import React from 'react';

const Dashboard = () => {
  return (
    <div className="dashboard">
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
    </div>
  );
};

export default Dashboard;
