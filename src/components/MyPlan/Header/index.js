import { useIntl } from 'react-intl';

export const Header = () => {
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
              Lorem ipsum dolor sit amet consectetur. Ac eleifend diam lobortis montes eget proin
              purus. Faucibus viverra suspendisse molestie viverra.
            </p>
          </div>
        </div>
        <span className="arrow"></span>
      </div>
    </header>
  );
};
