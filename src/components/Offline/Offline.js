import React from 'react';

const Offline = () => (
  <div>
    <header style={{ height: '84px' }}></header>
    <main style={{ display: 'block', widht: '100%' }}>
      <section class="section__block image__main">
        <div class="wrapper" style={{ width: '800px', margin: 'auto' }}>
          <h1 style={{ 'padding-bottom': '0' }}>Experimentamos dificultades técnicas.</h1>
          <h2
            style={{
              'font-size': '18px',
              'font-weight': '400',
              'line-height': '1.2',
              'letter-spacing': '0',
              color: '#525845',
              padding: '0 0 10px',
            }}
          >
            ¡Lo sentimos! Estamos trabajando para solucionarlas.
          </h2>
          <img
            style={{ padding: '10px 0 30px' }}
            src="https://www.fromdoppler.com/images/appdown/main.svg"
            alt=""
          />
          <p>
            <strong>
              El tiempo estimado de resolución es de 2:30 horas. ¡Gracias por tu paciencia!{' '}
            </strong>
          </p>
        </div>
      </section>
    </main>
  </div>
);

export default Offline;
