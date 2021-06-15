import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { Breadcrumb, BreadcrumbItem } from '../shared/Breadcrumb/Breadcrumb';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';
import { Switch } from '../shared/Switch/Switch';

export const ContactPolicy = () => {
  const [active, toggleActive] = useState(false);
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <Helmet>
        <title>{_('contact_policy.meta_title')}</title>
      </Helmet>
      <HeaderSection>
        <div className="col-sm-12 col-md-12 col-lg-12">
          <Breadcrumb>
            <BreadcrumbItem href={_('common.control_panel_url')} text={_('common.control_panel')} />
            <BreadcrumbItem text={_('contact_policy.title')} />
          </Breadcrumb>
          <h2>{_('contact_policy.title')}</h2>
          <FormattedMessageMarkdown linkTarget={'_blank'} id="contact_policy.subtitle_MD" />
        </div>
      </HeaderSection>
      <section className="dp-container">
        <div className="dp-rowflex">
          <div className="col-lg-6 col-md-12 col-sm-12 m-b-24">
            <form className="dp-contact-policy-form">
              <fieldset>
                <legend>{_('contact_policy.title')}</legend>
                <ul className="field-group">
                  <li className="field-item">
                    <Switch
                      id="switch-contact-policy"
                      text={_('contact_policy.toggle_text')}
                      defaultChecked={active}
                      onChange={(value) => {
                        toggleActive(value);
                      }}
                    />
                  </li>
                </ul>
              </fieldset>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
