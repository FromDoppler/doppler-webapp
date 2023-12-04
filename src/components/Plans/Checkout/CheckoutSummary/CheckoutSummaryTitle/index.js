import { useIntl } from 'react-intl';
import { BreadcrumbNew, BreadcrumbNewItem } from '../../../../shared/BreadcrumbNew';
import { useLocation } from 'react-router-dom';

export const CheckoutSummaryTitle = ({ title }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const location = useLocation();

  return (
    <>
      <div className="col-sm-12 col-md-12 col-lg-12">
        <BreadcrumbNew>
          <BreadcrumbNewItem
            href={_('buy_process.plan_selection.breadcumb_plan_url')}
            text={_('buy_process.plan_selection.breadcumb_plan_text')}
          />
          <BreadcrumbNewItem
            href={`${location.pathname}${location.search}`}
            text={_(title.smallTitle)}
          />
        </BreadcrumbNew>
        <h2 className="dp-first-order-title">
          Disfruta Doppler <span className="dpicon iconapp-launch" />
        </h2>
      </div>
    </>
  );
};
