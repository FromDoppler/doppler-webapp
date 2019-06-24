import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Loading from '../../Loading/Loading';
import { InjectAppServices } from '../../../services/pure-di';

const Shopify = ({ dependencies: { shopifyClient } }) => {
  const [shops, setShops] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const result = await shopifyClient.getShopifyData();
      if (result.expectedError && result.expectedError.cannotConnectToAPI) {
        setError('Error: No hemos podido conectar con la Api de Shopify, vuelve a intentar luego.');
      } else if (!result.success) {
        setError('Error: Error inesperado.');
      } else if (result.value.length) {
        setIsConnected(true);
        setShops(result.value);
      }
      setIsLoading(false);
    };
    getData();
  }, [shopifyClient]);

  return (
    <>
      <Helmet title={'Doppler | Shopify'} />
      {/* inline style will be removed in next PR */}
      <section style={{ width: '100%', padding: '60px 30px' }}>
        Panel de control | Integraciones y preferencias avanzadas
        <h1>Panel de Control - Shopify</h1>
        {isLoading ? (
          <Loading />
        ) : error ? (
          <p>{error}</p>
        ) : isConnected ? (
          <>
            <p>Shopify conectado a: </p>
            <ul>
              {shops.map((shop) => (
                <li key={shop.shopName}> {shop.shopName} </li>
              ))}{' '}
            </ul>
          </>
        ) : (
          <p>Shopify desconectado</p>
        )}
      </section>
    </>
  );
};

export default InjectAppServices(Shopify);
