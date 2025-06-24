import { useIntl } from 'react-intl';

export const AdditionalServices = () => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <header className="hero-banner">
      <div className="dp-container">
        <div className="dp-rowflex">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <h2 className="dp-first-order-title">{_('my_plan.addtional_services.title')}</h2>
          </div>
          <div className="col-sm-7">
            <p>{_('my_plan.addtional_services.description')}</p>
          </div>
        </div>
        <span className="arrow"></span>
      </div>
    </header>
  );
};
