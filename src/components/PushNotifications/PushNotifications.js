import React from 'react';
import { Helmet } from 'react-helmet';

const pushUrl = `${process.env.REACT_APP_DATA_HUB_URL}/public/push.js`;
const workerUrl = `${process.env.REACT_APP_DATA_HUB_URL}/public/firebase-messaging-sw.js`;
const PushNotifications = () => (
  <>
    <Helmet>
      <meta name="robots" content="noindex,nofollow" />
      <script src={pushUrl} type="text/javascript" />
    </Helmet>
    <div className="dp-app-container">
      <header className="hero-banner report-filters">
        <div className="dp-container">
          <div className="dp-rowflex">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <h2>Push Notifications</h2>
              <p>Aqui podremos ver el avance sobre push.</p>
            </div>
          </div>
          <span className="arrow"></span>
        </div>
      </header>
      <section className="dp-container">
        <div className="dp-block-wlp dp-box-shadow">
          <div style={{ marginLeft: '20px' }}>
            <h3>Como se si estoy suscripto a notificaciones?</h3>
            <p>
              Podemos abrir la consola con F12 deberiamos ver <br />
              <br />
              "FCM: permission granted"
              <br />
              Save token into dha visitor, <br />
              token values is: eYunKv.. <br />
              <br />
              El id de token nos permitira enviar mensajes a ese visitor individualmente. <br />
              Tambien podemos validar en local storage con la clave{' '}
              <strong>_dha__push_token</strong> en <strong>true</strong>
            </p>
          </div>
        </div>
        <div className="dp-block-wlp dp-box-shadow m-t-36">
          <div style={{ marginLeft: '20px' }}>
            <h3>Como instalar push en otro sitio</h3>
            <p>
              Debe estar el script de datahub y cargarse por completo primero, luego sumar push{' '}
              <br />
              <code>{`<script src=${pushUrl} type="text/javascript" />`}</code>
              <br />
              Copiar en la raiz del dominio el worker, se puede descargar desde: <br />
              <code>{workerUrl}</code>
            </p>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default PushNotifications;
