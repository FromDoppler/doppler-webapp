import React, { useReducer, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { ControlPanelBox } from '../shared/ControlPanelBox/ControlPanelBox';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import * as S from './index.styles';
import connected from './images/connected.png';
import connection_alert from './images/connection_alert.png';
import disconnected from './images/disconnected.png';
import { Loading } from '../Loading/Loading';
import {
  INITIAL_STATE,
  INTEGRATION_SECTION_ACTIONS,
  IntegrationReducer,
} from './reducers/IntegrationReducer';
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

export const IntegrationsSection = InjectAppServices(
  ({ dependencies: { controlPanelService, dopplerUserApiClient } }) => {
    const intl = useIntl();
    const _ = useCallback((id, values) => intl.formatMessage({ id }, values), [intl]);
    const [{ integrationSection, loadingPage, loadingNativeIntegrations }, dispatch] = useReducer(
      IntegrationReducer,
      INITIAL_STATE,
    );

    useEffect(() => {
      const fetchData = async () => {
        dispatch({
          type: INTEGRATION_SECTION_ACTIONS.START_FETCH,
        });

        const _integrationSection = controlPanelService.getControlPanelSections(_, true);
        dispatch({
          type: INTEGRATION_SECTION_ACTIONS.GET_SECTIONS,
          payload: _integrationSection,
        });

        const integrationsStatusResult = await dopplerUserApiClient.getIntegrationsStatus();
        if (integrationsStatusResult.success) {
          dispatch({
            type: INTEGRATION_SECTION_ACTIONS.GET_INTEGRATIONS_STATUS,
            payload: integrationsStatusResult.value,
          });
        } else {
          dispatch({
            type: INTEGRATION_SECTION_ACTIONS.GET_INTEGRATIONS_STATUS_FAILED,
          });
        }
      };

      fetchData();
    }, [controlPanelService, dopplerUserApiClient, _]);

    useHashScrollHandler();

    if (loadingPage) {
      return <Loading page />;
    }

    return (
      <>
        <Helmet title={_('integrations.title')} />
        <HeaderSection>
          <div className="col-lg-10 col-md-12">
            <h2>{_('integrations.title')}</h2>
          </div>
        </HeaderSection>

        <section className="dp-container">
          <div className="dp-rowflex">
            {integrationSection.map((section, indexSection) => (
              <div key={`section-${indexSection}`} className="col-lg-12 col-md-12 m-b-24">
                <div className="dp-bg-ghostwhite dp-box-shadow m-b-24">
                  <S.TitleContainer>
                    <h3 className="m-b-24" id={section.anchorLink}>
                      {section.title}
                    </h3>
                    {section.showStatus && !loadingNativeIntegrations ? (
                      <S.StatusBoxContainer className="m-b-24">
                        <S.StatusIcon src={connection_alert} alt="connection alert icon" />
                        <span className="yellow-color">{_('integrations.status_alert')}</span>
                        <S.StatusIcon src={disconnected} alt="disconnected icon" />
                        <span className="lightgrey-color">
                          {_('integrations.status_not_connected')}
                        </span>
                        <S.StatusIcon src={connected} alt="connection icon" />
                        <span className="lightgreen-color">
                          {_('integrations.status_connected')}
                        </span>
                      </S.StatusBoxContainer>
                    ) : (
                      <></>
                    )}
                  </S.TitleContainer>
                  {section.showStatus && loadingNativeIntegrations ? (
                    <Loading page />
                  ) : (
                    <div className="dp-rowflex" aria-label="Boxes Container">
                      {integrationSection[indexSection].boxes
                        .sort(sortByStatus)
                        .map((box, indexBox) => (
                          <ControlPanelBox box={box} key={`box-${indexBox}`} />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  },
);

export default InjectAppServices(IntegrationsSection);
