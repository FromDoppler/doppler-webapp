import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { StepperStyled } from './index.styles';

export const Stepper = ({ steps }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const { pathname } = useLocation();

  const activeStepIndex = steps.findIndex((st) => pathname.includes(st.pathname));
  const safeActiveStepIndex = activeStepIndex >= 0 ? activeStepIndex : 0;
  const activeStep = steps[safeActiveStepIndex];
  const nextStep = steps[safeActiveStepIndex + 1] ?? null;
  const progressAngle = `${Math.max((safeActiveStepIndex + 1) / steps.length, 0.2) * 360}deg`;
  const progressLabel = intl.formatMessage(
    { id: 'buy_process.stepper.mobile_progress' },
    {
      currentStep: safeActiveStepIndex + 1,
      totalSteps: steps.length,
    },
  );

  return (
    <StepperStyled>
      <div className="dp-container-steper hero-banner">
        <ul className="dp-steper dp-stepper-desktop">
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

        {activeStep && (
          <div className="dp-stepper-mobile" data-testid="dp-stepper-mobile">
            <span className="dp-stepper-mobile-back-icon" aria-hidden="true">
              ‹
            </span>
            <div className="dp-stepper-mobile-copy">
              <p className="dp-stepper-mobile-title">
                {intl.formatMessage(
                  { id: 'buy_process.stepper.mobile_current_step_title' },
                  {
                    stepNumber: safeActiveStepIndex + 1,
                    stepName: _(activeStep.label),
                  },
                )}
              </p>
              {nextStep && (
                <p className="dp-stepper-mobile-subtitle">
                  {intl.formatMessage(
                    { id: 'buy_process.stepper.mobile_next_step_subtitle' },
                    {
                      stepNumber: safeActiveStepIndex + 2,
                      stepName: _(nextStep.label),
                    },
                  )}
                </p>
              )}
            </div>

            <div
              className="dp-stepper-mobile-progress"
              data-progress={progressLabel}
              aria-label={progressLabel}
              style={{ '--step-progress-angle': progressAngle }}
            >
              <span className="dp-stepper-mobile-progress-sr-only">{progressLabel}</span>
            </div>
          </div>
        )}
      </div>
    </StepperStyled>
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
