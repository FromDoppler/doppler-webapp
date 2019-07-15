import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Loading from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';
import logo from './logo.svg';
import './Shopify.css';

const Shopify = ({ dependencies: { shopifyClient } }) => {
  const [shops, setShops] = useState([]);
  const [isConnected, setIsConnected] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const result = await shopifyClient.getShopifyData();
      if (result.expectedError && result.expectedError.cannotConnectToAPI) {
        setError(
          'Error: No hemos podido conectar con la Api de Shopify, vuelve a intentar luego. Texto nuevo.',
        );
      } else if (!result.success) {
        setError('Error: Error inesperado.');
      } else if (result.value.length) {
        setIsConnected(true);
        setShops(result.value);
        setError(null);
      } else {
        setIsConnected(false);
        setError(null);
        setShops(result.value);
      }
      setIsLoading(false);
    };
    getData();
  }, [shopifyClient]);

  const shopifyHeader = (
    <>
      <div className="block">
        <h2>Panel de Control - Shopify</h2>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Consequuntur facere velit
          officia quibusdam perspiciatis impedit veritatis et, ducimus dolorem{' '}
          <a href="http://fromdoppler.com">corporis</a>.
        </p>
      </div>
      <hr />
    </>
  );

  return (
    <>
      <Helmet title={'Doppler | Shopify'} />
      {/* inline styles will be removed when breadcrum is ready in ui library */}
      <section className="page-wrapper" style={{ marginTop: '20px', marginBottom: '20px' }}>
        Panel de control | Integraciones y preferencias avanzadas
        <div className="dp-integration" style={{ marginTop: '20px' }}>
          {isLoading ? (
            <>
              <div className="dp-integration__block">
                {shopifyHeader}
                <div className="block"></div>
              </div>
              <Loading />
            </>
          ) : error ? (
            <div className="dp-integration__block">
              {shopifyHeader}
              <div className="block">
                <p>{error}</p>
              </div>
            </div>
          ) : isConnected ? (
            <>
              <div className="dp-integration__block">
                {shopifyHeader}
                <div className="block dp-integration__status">
                  <div className="status__info">
                    <div>
                      <img class="shopify-logo" src={logo} alt="Shopify logo" />
                      <div className="status__data">
                        <p>
                          Ultima fecha de sincronización: <time>22/06/2019</time>
                        </p>
                        <ul>
                          {shops.map((shop) => (
                            <li key={shop.shopName}>
                              <p>
                                Nombre de la tienda: <strong> {shop.shopName} </strong>
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="dp-button button-big primary-green">
                    Desconectar
                  </button>
                </div>
              </div>
              <div className="dp-integration__block dp-integration--info">
                <header className="block">
                  <div>
                    <h2>Listas creadas</h2>
                    <p>
                      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et praesentium
                      distinctio obcaecati.
                    </p>
                  </div>
                  {/*<button className="dp-button button--has-icon"><span class="ms-icon icon-reload"></span></button> TODO: enable this button when ready*/}
                </header>
                <hr />
                <div className="block">
                  <ul>
                    {shops.map((shop) => (
                      <li key={shop.list.id}>
                        <p>
                          Nombre de la lista: <strong> {shop.list.name} </strong>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="dp-integration__block">
                {shopifyHeader}
                <div class="block">
                  Parece que aun no has conectado tu cuenta. Haz click en conectar.
                </div>
              </div>

              <footer className="dp-integration__actions">
                <button type="button" className="dp-button button-big primary-grey">
                  Atrás
                </button>
                <button type="button" className="dp-button button-big primary-green">
                  Conectar
                </button>
              </footer>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default InjectAppServices(Shopify);
