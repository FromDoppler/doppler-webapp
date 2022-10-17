import React, { useReducer, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { ControlPanelBox } from './ControlPanelBox/ControlPanelBox';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import * as S from './ControlPanel.styles';
import connected from './images/connected.png';
import connection_alert from './images/connection_alert.png';
import disconnected from './images/disconnected.png';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Loading } from '../Loading/Loading';
import {
  INITIAL_STATE,
  CONTROL_PANEL_SECTIONS_ACTIONS,
  controlPanelSectionsReducer,
} from './reducers/controlPanelSectionsReducer';
import useHashScrollHandler from '../../hooks/useHashScrollHandler';

const sortByStatus = (a, b) => {
  return a.status
    ? a.status === 'alert' && b.status !== 'alert'
      ? -1
      : a.status === 'alert' && b.status === 'alert'
      ? 0
      : a.status === 'connected' && b.status === 'alert'
      ? 1
      : a.status === 'connected' && b.status === 'connected'
      ? 0
      : a.status === 'connected' && b.status === 'disconnected'
      ? -1
      : a.status === 'disconnected' && b.status === 'alert'
      ? 1
      : a.status === 'disconnected' && b.status === 'connected'
      ? 1
      : a.status === 'disconnected' && b.status === 'disconnected'
      ? 0
      : -1
    : 1;
};

export const ControlPanel = InjectAppServices(
  ({ dependencies: { controlPanelService, dopplerUserApiClient } }) => {
    const intl = useIntl();
    const _ = useCallback((id, values) => intl.formatMessage({ id }, values), [intl]);
    const [{ controlPanelSections, loading }, dispatch] = useReducer(
      controlPanelSectionsReducer,
      INITIAL_STATE,
    );

    useEffect(() => {
      const fetchData = async () => {
        dispatch({
          type: CONTROL_PANEL_SECTIONS_ACTIONS.START_FETCH,
        });

        const _controlPanelSections = controlPanelService.getControlPanelSections(_);
        dispatch({
          type: CONTROL_PANEL_SECTIONS_ACTIONS.GET_SECTIONS,
          payload: _controlPanelSections,
        });

        const integrationsStatusResult = await dopplerUserApiClient.getIntegrationsStatus();
        if (integrationsStatusResult.success) {
          dispatch({
            type: CONTROL_PANEL_SECTIONS_ACTIONS.GET_INTEGRATIONS_STATUS,
            payload: integrationsStatusResult.value,
          });
        }
      };

      fetchData();
    }, [controlPanelService, dopplerUserApiClient, _]);

    useHashScrollHandler();

    if (loading) {
      return <Loading page />;
    }

    return (
      <>
        <Helmet title={_('control_panel.title')} />
        <HeaderSection>
          <div className="col-lg-10 col-md-12">
            <h2>{_('control_panel.title')}</h2>
            <FormattedMessageMarkdown id={'control_panel.subtitle_MD'} />
          </div>
        </HeaderSection>

        <section className="dp-container">
          <div className="dp-rowflex">
            {controlPanelSections.map((section, indexSection) => (
              <div key={`section-${indexSection}`} className="col-lg-12 col-md-12 m-b-24">
                <div className="dp-bg-ghostwhite dp-box-shadow m-b-24">
                  <S.TitleContainer>
                    <h3 className="m-b-24" id={section.anchorLink}>
                      {section.title}
                    </h3>
                    {section.showStatus ? (
                      <S.StatusBoxContainer className="m-b-24">
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
  },
);
