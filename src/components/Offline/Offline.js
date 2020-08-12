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
          <h1>Estamos trabajando en mejorar tu experiencia</h1>
          <S.AccentText>
            Realizaremos <strong>tareas programadas de mantenimiento</strong>
          </S.AccentText>
          <S.AccentText>durante la próxima hora. ¡Vuelve pronto!</S.AccentText>
        </S.CenterColumn>
      </S.CenterContent>
      <S.HideChat />
    </section>
  </div>
);

export default Offline;
