import React from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { ControlPanelBox } from './ControlPanelBox/ControlPanelBox';
import { controlPanelSections } from './controlPanelSections';
import { useIntl } from 'react-intl';

export const ControlPanel = () => {
  const _ = (id, values) => useIntl().formatMessage({ id }, values);

  return (
    <>
      <Helmet title={_('control_panel.title')} />
      <HeaderSection>
        <div className="col-lg-10 col-md-12">
          <h2>{_('control_panel.title')}</h2>
        </div>
      </HeaderSection>

      <section className="dp-container">
        <div className="dp-rowflex">
          {controlPanelSections.map((section, indexSection) => (
            <div key={`section-${indexSection}`} className="col-lg-12 col-md-12 m-b-24">
              <div className="dp-bg-ghostwhite dp-box-shadow m-b-24">
                <h2>{_(section.title)}</h2>
                <div className="dp-rowflex">
                  {section.items.map((box, indexBox) => (
                    <ControlPanelBox box={box} key={`box-${indexBox}`} />
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
