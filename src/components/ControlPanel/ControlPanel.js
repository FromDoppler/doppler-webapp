import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { ControlPanelBox } from '../shared/ControlPanelBox/ControlPanelBox';
import { useIntl } from 'react-intl';
import { InjectAppServices } from '../../services/pure-di';
import * as S from './ControlPanel.styles';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import useHashScrollHandler from '../../hooks/useHashScrollHandler';

export const ControlPanel = InjectAppServices(({ dependencies: { controlPanelService } }) => {
  const intl = useIntl();
  const _ = useCallback((id, values) => intl.formatMessage({ id }, values), [intl]);
  const getInitialSections = () => controlPanelService.getControlPanelSections(_);
  const [controlPanelSections] = useState(getInitialSections);
  useHashScrollHandler();

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
                </S.TitleContainer>
                <div className="dp-rowflex" aria-label="Boxes Container">
                  {controlPanelSections[indexSection].boxes.map((box, indexBox) => (
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
});
