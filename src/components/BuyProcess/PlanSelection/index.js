import { useIntl } from 'react-intl';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import { BreadcrumbNew, BreadcrumbNewItem } from '../../shared/BreadcrumbNew';
import HeaderSection from '../../shared/HeaderSection/HeaderSection';

export const PlanSelection = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <HeaderSection>
      <div className="col-sm-12 col-md-12 col-lg-12">
        <BreadcrumbNew>
          <BreadcrumbNewItem
            href={_('buy_process.plan_selection.breadcumb_plan_url')}
            text={_('buy_process.plan_selection.breadcumb_plan_text')}
          />
        </BreadcrumbNew>
        <h1 className="m-t-24">
          <span className="dpicon iconapp-email-alert m-r-6" />
          {_(`buy_process.plan_selection.plan_title`)}
        </h1>
        <h2>{_('checkoutProcessSuccess.plan_type')}</h2>
        <FormattedMessageMarkdown
          linkTarget={'_blank'}
          id="buy_process.plan_selection.plan_subtitle_MD"
        />
      </div>
    </HeaderSection>
  );
};
