import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { HardcodedShopifyClient } from '../../../services/shopify-client.doubles';
import Loading from '../../Loading/Loading';

const shopifyClient = new HardcodedShopifyClient();

const Shopify = () => {
  const [shopName, setShopName] = useState(null);
  useEffect(() => {
    const getData = async () => {
      const result = await shopifyClient.getShopifyData();
      if (result.length) {
        setShopName(result[0].shopName);
      } else {
        setShopName('');
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
        {shopName === null ? (
          <Loading />
        ) : shopName.length ? (
          'Shopify conectado a tienda: ' + shopName
        ) : (
          'Shopify desconectado'
        )}
      </section>
    </>
  );
};

export default Shopify;
