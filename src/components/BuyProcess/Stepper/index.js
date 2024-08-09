import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';

export const Stepper = ({ steps }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { pathname } = useLocation();

  const activeStepIndex = steps.findIndex((st) => pathname.includes(st.pathname));
  return (
    <div className="dp-container-steper hero-banner">
      <ul className="dp-steper">
        {steps.map((step, index) => (
          <li key={`step-${index}`} className={`${index <= activeStepIndex ? 'active' : ''}`}>
            {pathname.includes(step.pathname) && <span className="step-active" />}
            <span>
              <span className={step.icon} />
              {_(step.label)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      icon: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
