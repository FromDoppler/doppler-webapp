import React from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { ControlPanelBox } from './ControlPanelBox';
import { controlPanelSections } from './ControlPanelSections';

export const ControlPanel = () => {
  return (
    <>
      <Helmet title="Doppler | Control Panel" />
      <HeaderSection>
        <div className="col-lg-10 col-md-12">
          <h2>Panel de Control</h2>
        </div>
      </HeaderSection>

      <section className="dp-container">
        <div className="dp-rowflex">
          {controlPanelSections.map((section, index1) => (
            <div key={`section-${index1}`}
              className="col-lg-12 col-md-12 m-b-24">
              <div className="dp-bg-ghostwhite dp-box-shadow m-b-24">
                <h2>{section.title}</h2>
                <div className="dp-rowflex">
                  {section.items.map((box, index) => (
                    <ControlPanelBox
                      linkUrl={box.linkUrl}
                      iconName={box.iconName}
                      imgSrc={box.imgSrc}
                      imgAlt={box.imgAlt}
                      key={`box-${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
