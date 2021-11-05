import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { ControlPanelBox } from './ControlPanelBox/ControlPanelBox';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import * as S from './ControlPanel.styles';
import connected from './images/connected.png';
import connection_alert from './images/connection_alert.png';
import disconnected from './images/disconnected.png';

const sortByStatus = (a, b) => {
  return a.status
    ? a.status === 'alert' && b.status !== 'alert'
      ? -1
      : a.status === 'alert' && b.status === 'alert'
      ? 0
      : a.status === 'disconnected'
      ? 1
      : a.status === 'connected' && b.status === 'alert'
      ? 1
      : a.status === 'connected' && b.status === 'connected'
      ? 0
      : -1
    : 2;
};

export const ControlPanel = InjectAppServices(({ dependencies: { controlPanelService } }) => {
  const getInitialSections = () => controlPanelService.getControlPanelSections();
  const [controlPanelSections] = useState(getInitialSections);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id }, values);

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
                <S.TitleContainer>
                  <h2>{_(section.title)}</h2>
                  {section.showStatus ? (
                    <S.StatusBoxContainer>
                      <S.StatusIcon src={connection_alert} alt="connection alert icon" />
                      <span className="yellow-color">{_('control_panel.status_alert')}</span>
                      <S.StatusIcon src={disconnected} alt="disconnected icon" />
                      <span className="lightgrey-color">
                        {_('control_panel.status_not_connected')}
                      </span>
                      <S.StatusIcon src={connected} alt="connection icon" />
                      <span className="lightgreen-color">
                        {_('control_panel.status_connected')}
                      </span>
                    </S.StatusBoxContainer>
                  ) : (
                    <></>
                  )}
                </S.TitleContainer>
                <div className="dp-rowflex" aria-label="Boxes Container">
                  {controlPanelSections[indexSection].boxes
                    .sort(sortByStatus)
                    .map((box, indexBox) => (
                      <ControlPanelBox
                        box={box}
                        key={`box-${indexBox}`}
                        disabled={!!box.disabled}
                        hidden={!!box.hidden}
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
});
