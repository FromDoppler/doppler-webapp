import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { HardcodedShopifyClient } from '../../../services/shopify-client.doubles';
import Loading from '../../Loading/Loading';

const shopifyClient = new HardcodedShopifyClient();

const Shopify = () => {
  const [shopName, setShopName] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const result = await shopifyClient.getShopifyData();
      if (result.success && result.value.length) {
        setShopName(result.value[0].shopName);
      } else if (result.success) {
        setShopName('');
      } else if (
        !result.success &&
        result.expectedError &&
        result.expectedError.cannotConnectToAPI
      ) {
        setError('Error: No hemos podido conectar con la Api de Shopify, vuelve a intentar luego.');
      } else {
        setError('Error: Error inesperado.');
      }
    };
    getData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Doppler | Shopify</title>
      </Helmet>
      <section style={{ width: '100%', padding: '60px 30px' }}>
        Panel de control | Integraciones y preferencias avanzadas
        <h1>Panel de Control - Shopify</h1>
        {shopName === null && error === null ? (
          <Loading />
        ) : shopName !== null && shopName.length ? (
          'Shopify conectado a tienda: ' + shopName
        ) : error === null ? (
          'Shopify desconectado'
        ) : (
          error
        )}
      </section>
    </>
  );
};

export default Shopify;
