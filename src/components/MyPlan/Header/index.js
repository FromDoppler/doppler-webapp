import { useIntl } from 'react-intl';

export const Header = ({ activeTab }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <header className="hero-banner">
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">
              {_('my_plan.title')} <span className="dpicon iconapp-checklist"></span>
            </h2>
          </div>
          <div className="col-sm-7">
            <p>
              {_(
                `my_plan.${
                  activeTab === 'subscriptionDetails' ? 'subscription_details' : 'addons'
                }.subtitle`,
              )}
            </p>
          </div>
        </div>
        <span className="arrow"></span>
      </div>
    </header>
  );
};
