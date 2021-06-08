import React from 'react';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import HeaderSection from '../shared/HeaderSection/HeaderSection';
import { InjectAppServices } from '../../services/pure-di';
import { Breadcrumb, BreadcrumbItem } from '../shared/Breadcrumb/Breadcrumb';
import { FormattedMessageMarkdown } from '../../i18n/FormattedMessageMarkdown';

export const ContactPolicy = InjectAppServices(() => {
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
      <section className="dp-container" />
    </>
  );
});
