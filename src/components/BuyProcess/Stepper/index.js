import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

export const Stepper = ({ steps }) => {
  const { pathname } = useLocation();

  return (
    <div className="dp-container-steper">
      <ul className="dp-steper">
        {steps.map((step, index) => (
          <li
            key={`step-${index}`}
            className={`${pathname.includes(step.pathname) ? 'active' : ''}`}
          >
            <span>
              <span className={step.icon} />
              {step.label}
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
