import React from 'react';
import { Helmet } from 'react-helmet';
import * as S from './Offline.styles';

const Offline = () => (
  <div className="dp-app-container">
    <Helmet>
      <meta name="robots" content="noindex,nofollow" />
    </Helmet>
    <section className="dp-container">
      <S.CenterContent>
        <S.CenterColumn>
          <div className="logo-doppler-new"></div>
          <S.MaintenanceImage></S.MaintenanceImage>
          <h1>Estamos realizando tareas de mantenimiento</h1>
          <S.AccentText>
            No te preocupes, <strong>tus Campañas se siguen enviando ;)</strong>
          </S.AccentText>
          <S.AccentText>Trabajamos para mejorar tu experiencia ¡Vuelve pronto!</S.AccentText>
        </S.CenterColumn>
      </S.CenterContent>
      <S.HideChat />
    </section>
  </div>
);

export default Offline;
