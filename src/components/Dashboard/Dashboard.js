import React, { useEffect, useState } from 'react';
import { Carousel } from './Carousel/Carousel';
import { Slide } from './Carousel/Slide/Slide';
import { TextPreviewPost } from './TextPreviewPost/TextPreviewPost';
import { KpiGroup, DashboardIconSubTitle, DashboardIconLink } from './Kpis/KpiGroup';
import { Kpi } from './Kpis/Kpi';

export const carouselColors = [{ orange: 'orange' }, { purple: 'purple' }];

export const kpiListFake = {
  Campaings: [
    {
      kpiTitle: `Total de Envios`,
      kpiValue: `21458`,
      iconClass: `deliveries`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `Tasa de Apertura`,
      kpiValue: `57%`,
      iconClass: `open-rate`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `CTR`,
      kpiValue: `215%`,
      iconClass: `ctr`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
  ],
  Subscribers: [
    {
      kpiTitle: `Total de Contactos`,
      kpiValue: `21458`,
      iconClass: `book`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `Contactos Nuevos`,
      kpiValue: `943`,
      iconClass: `user-new`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
    {
      kpiTitle: `Contactos removidos`,
      kpiValue: `94`,
      iconClass: `user-removed`,
      kpiPeriod: `ULTIMOS 30 DIAS`,
      active: true,
    },
  ],
};

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
  const [kpiList, setKpiList] = useState({});

  useEffect(() => {
    const campaings = kpiListFake.Campaings;
    const subscribers = kpiListFake.Subscribers;

    setKpiList({
      campaings,
      subscribers,
    });
  }, []);

  const renderKpis = (listType) => {
    return kpiList[listType]?.map((kpi, index) => (
      <Kpi key={`kpi-campaing-${index}`} {...kpi} colSize={kpiListSize[listType]}></Kpi>
    ));
  };

  const kpiListSize = {
    campaings: 12 / (!kpiListFake.Campaings?.length ? 1 : kpiListFake.Campaings.length),
    subscribers: 12 / (!kpiListFake.Subscribers?.length ? 1 : kpiListFake.Subscribers.length),
  };

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
        <div className="dp-rowflex">
          <div className="col-lg-12 col-md-12 m-b-24">
            <div className="dp-dashboard-title">
              <DashboardIconSubTitle
                title="Mis Campañas"
                iconClass="deliveries"
              ></DashboardIconSubTitle>
              <DashboardIconLink linkTitle="CAMPAÑAS ENVIADAS" link="#"></DashboardIconLink>
            </div>
            <KpiGroup>{renderKpis('campaings')}</KpiGroup>
            <div className="dp-dashboard-title">
              <DashboardIconSubTitle
                title="Mis Contactos"
                iconClass="subscribers"
              ></DashboardIconSubTitle>
              <DashboardIconLink linkTitle="CAMPAÑAS ENVIADAS" link="#"></DashboardIconLink>
            </div>
            <KpiGroup disabled={true}>{renderKpis('subscribers')}</KpiGroup>
          </div>
          <div className="col-lg-3 col-sm-12"></div>
          <div className="col-sm-12 col-md-12">
            <div className="dp-dashboard-title">
              <DashboardIconSubTitle
                title="Aprende con Doppler"
                iconClass="dp-learn-with-doppler"
              ></DashboardIconSubTitle>
            </div>
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
      </div>
    </div>
  );
};
