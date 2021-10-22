import React from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { ControlPanelBox } from './ControlPanelBox/ControlPanelBox';
import { getControlPanelSections } from './controlPanelSections';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';

export const ControlPanel = InjectAppServices(({ dependencies: { appSessionRef } }) => {
  const _ = (id, values) => useIntl().formatMessage({ id }, values);
  const isClientManager = appSessionRef.current.userData.user.hasClientManager;
  const siteTrackingEnabled = appSessionRef.current.userData.features.siteTrackingEnabled;

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
          {getControlPanelSections(isClientManager, siteTrackingEnabled).map(
            (section, indexSection) => (
              <div key={`section-${indexSection}`} className="col-lg-12 col-md-12 m-b-24">
                <div className="dp-bg-ghostwhite dp-box-shadow m-b-24">
                  <h2>{_(section.title)}</h2>
                  <div className="dp-rowflex">
                    {section.items.map((box, indexBox) =>
                      box !== null ? (
                        <ControlPanelBox
                          box={box}
                          key={`box-${indexBox}`}
                          disabled={!!box.disabled}
                        />
                      ) : (
                        <div key={`box-${indexBox}`}></div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </section>
    </>
  );
});
