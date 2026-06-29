import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { PLAN_TYPE } from '../../../../doppler-types';

const numberFormatOptions = {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
  useGrouping: true,
};

const getFormattedPriceOptions = (value) => ({
  ...numberFormatOptions,
  minimumFractionDigits: 2,
});

const capitalize = (value = '') =>
  value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';

export const StickyPlanSummary = ({ summary }) => {
  const intl = useIntl();

  if (!summary) {
    return null;
  }

  const planType = summary.planType || PLAN_TYPE.byContact;
  const planTitleMessageId =
    planType === PLAN_TYPE.byEmail
      ? 'buy_process.new_plan_selection.emails_plan_title'
      : 'buy_process.new_plan_selection.contacts_plan_title';
  const subtitleMessageId =
    planType === PLAN_TYPE.byEmail
      ? 'buy_process.new_plan_selection.sticky_emails_subtitle'
      : 'buy_process.new_plan_selection.sticky_contacts_subtitle';
  const amountLabel = summary.amountLabel ?? summary.contactsLabel;

  return (
    <section className="dp-new-plan-selection-sticky-summary" data-testid="dp-sticky-plan-summary">
      <div className="dp-new-plan-selection-sticky-summary-content">
        <div className="dp-new-plan-selection-sticky-summary-copy">
          <h1 className="dp-new-plan-selection-sticky-summary-title">
            {summary.isCustomPlan ? (
              <FormattedMessage id="buy_process.new_plan_selection.sticky_custom_title" />
            ) : (
              <>
                <FormattedMessage id={planTitleMessageId} />{' '}
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
          </h1>

          <p className="dp-new-plan-selection-sticky-summary-subtitle">
            {summary.isCustomPlan ? (
              <FormattedMessage id="buy_process.new_plan_selection.sticky_custom_subtitle" />
            ) : (
              <FormattedMessage
                id={subtitleMessageId}
                values={{
                  contacts: amountLabel,
                  emails: amountLabel,
                }}
              />
            )}
          </p>
        </div>

        {!summary.isCustomPlan && summary.discountSummary && (
          <div className="dp-new-plan-selection-sticky-summary-discount">
            {summary.previousPrice != null && (
              <p className="dp-new-plan-selection-sticky-summary-old-price">
                <FormattedMessage id="buy_process.new_plan_selection.sticky_previous_price_label" />{' '}
                US$
                <span className="dp-new-plan-selection-old-price">
                  <FormattedNumber
                    value={summary.previousPrice}
                    {...getFormattedPriceOptions(summary.previousPrice)}
                  />
                </span>
                /
                {intl.formatMessage({
                  id: 'buy_process.new_plan_selection.month_period',
                })}
              </p>
            )}
            <p className="dp-new-plan-selection-sticky-summary-discount-text">
              {summary.discountSummary.type === 'promocode' ? (
                <FormattedMessage
                  id={
                    Number(summary.discountSummary.months) > 0
                      ? 'buy_process.new_plan_selection.sticky_promocode_discount_text'
                      : 'buy_process.new_plan_selection.sticky_promocode_discount_text_without_months'
                  }
                  values={{
                    months: summary.discountSummary.months,
                    percentage: summary.discountSummary.percentage,
                    bold: (chunks) => <b>{chunks}</b>,
                  }}
                />
              ) : (
                <FormattedMessage
                  id="buy_process.new_plan_selection.sticky_frequency_discount_text"
                  values={{
                    currency: 'US$',
                    percentage: summary.discountSummary.percentage,
                    period: summary.discountSummary.period,
                    periodCapitalized: capitalize(summary.discountSummary.period),
                    total: (
                      <FormattedNumber
                        value={summary.discountSummary.total}
                        {...getFormattedPriceOptions(summary.discountSummary.total)}
                      />
                    ),
                    bold: (chunks) => <b>{chunks}</b>,
                  }}
                />
              )}
            </p>
          </div>
        )}

        {summary.useAdvisorCta ? (
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
