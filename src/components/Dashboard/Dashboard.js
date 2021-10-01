import React from 'react';
import { Carousel } from './Carousel/Carousel';
import { Slide } from './Carousel/Slide/Slide';
import * as S from './Dashboard.styles';
import { TextPreviewPost } from './TextPreviewPost/TextPreviewPost';

export const carouselColors = [{ orange: 'orange' }, { purple: 'purple' }];

export const postList = [
  {
    id: `1`,
    title: `post 1`,
    description: `¿Cuáles son las diferencias entre servicio al cliente y atención al cliente?`,
    link: `http://localhost:3000/dashboard`,
  },
  {
    id: `2`,
    title: `post 2`,
    description: `Asesorías, acompañamiento exclusivo, IPs dedicadas o funcionalidades extra.`,
    link: `http://localhost:3000/dashboard`,
  },
];

export const Dashboard = () => {
  return (
    <div className="dp-dashboard p-b-48">
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
      <div className="dp-container">
        <S.Subtitle>
          <span>
            <img
              src="https://cdn.fromdoppler.com/doppler-ui-library/latest/img/icon-book.svg"
              alt="icon-title"
            />
          </span>
          Aprende con Doppler
        </S.Subtitle>
        <div className="dp-rowflex">
          <div className="col-sm-12 col-md-6">
            <Carousel id={'1'} color={'orange'}>
              {({ activeSlide }) =>
                postList.map((post, index) => (
                  <Slide key={post.id} active={activeSlide === index}>
                    <TextPreviewPost post={post} />
                  </Slide>
                ))
              }
            </Carousel>
          </div>
          <div className="col-sm-12 col-md-6">
            <Carousel id={'2'} color={'purple'}>
              {({ activeSlide }) =>
                postList.map((post, index) => (
                  <Slide key={post.id} active={activeSlide === index}>
                    <TextPreviewPost post={post} />
                  </Slide>
                ))
              }
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};
