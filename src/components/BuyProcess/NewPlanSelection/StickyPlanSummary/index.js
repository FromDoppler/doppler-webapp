import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

const numberFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
};

const getFormattedPriceOptions = (value) => ({
  ...numberFormatOptions,
  minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
});

export const StickyPlanSummary = ({ summary }) => {
  const intl = useIntl();

  if (!summary) {
    return null;
  }

  return (
    <section className="dp-new-plan-selection-sticky-summary" data-testid="dp-sticky-plan-summary">
      <div className="dp-new-plan-selection-sticky-summary-content">
        <div className="dp-new-plan-selection-sticky-summary-copy">
          <h3 className="dp-new-plan-selection-sticky-summary-title">
            {summary.isCustomPlan ? (
              <FormattedMessage id="buy_process.new_plan_selection.sticky_custom_title" />
            ) : (
              <>
                <FormattedMessage id="buy_process.new_plan_selection.contacts_plan_title" />{' '}
                <span className="dp-new-plan-selection-sticky-summary-price">
                  US$
                  <FormattedNumber
                    value={summary.displayPrice}
                    {...getFormattedPriceOptions(summary.displayPrice)}
                  />
                  /
                  {intl.formatMessage({
                    id: 'buy_process.new_plan_selection.month_period',
                  })}
                </span>
              </>
            )}
          </h3>

          <p className="dp-new-plan-selection-sticky-summary-subtitle">
            {summary.isCustomPlan ? (
              <FormattedMessage id="buy_process.new_plan_selection.sticky_custom_subtitle" />
            ) : (
              <FormattedMessage
                id="buy_process.new_plan_selection.sticky_contacts_subtitle"
                values={{ contacts: summary.contactsLabel }}
              />
            )}
          </p>
        </div>

        {summary.isCustomPlan ? (
          <Link className="dp-button button-medium primary-green" to={summary.ctaHref}>
            <FormattedMessage id="buy_process.new_plan_selection.sticky_custom_cta" />
          </Link>
        ) : summary.isDisabled ? (
          <button type="button" className="dp-button button-medium primary-green" disabled>
            <FormattedMessage id="buy_process.new_plan_selection.sticky_default_cta" />
          </button>
        ) : (
          <a className="dp-button button-medium primary-green" href={summary.ctaHref}>
            <FormattedMessage id="buy_process.new_plan_selection.sticky_default_cta" />
          </a>
        )}
      </div>
    </section>
  );
};
