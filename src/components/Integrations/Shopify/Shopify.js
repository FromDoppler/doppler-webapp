import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { HardcodedShopifyClient } from '../../../services/shopify-client.doubles';
import Loading from '../../Loading/Loading';

const shopifyClient = new HardcodedShopifyClient();

const Shopify = () => {
  const [shops, setShops] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const result = await shopifyClient.getShopifyData();
      if (result.success && result.value.length) {
        setIsConnected(true);
        setShops(result.value);
      } else if (
        !result.success &&
        result.expectedError &&
        result.expectedError.cannotConnectToAPI
      ) {
        setError('Error: No hemos podido conectar con la Api de Shopify, vuelve a intentar luego.');
      } else if (!result.success) {
        setError('Error: Error inesperado.');
      }
      setIsLoading(false);
    };
    getData();
  }, []);

  return (
    <>
      <Helmet title={'Doppler | Shopify'} />
      <section style={{ width: '100%', padding: '60px 30px' }}>
        Panel de control | Integraciones y preferencias avanzadas
        <h1>Panel de Control - Shopify</h1>
        {isLoading ? (
          <Loading />
        ) : error ? (
          error
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
          'Shopify desconectado'
        )}
      </section>
    </>
  );
};

export default Shopify;
