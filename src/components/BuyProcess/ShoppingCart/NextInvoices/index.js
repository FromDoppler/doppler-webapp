import { FormattedNumber, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { numberFormatOptions } from '../../../../doppler-types';

export const NextInvoices = ({ pathname, search, amountDetailsData }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);
  const nextMonthDate = new Date(amountDetailsData.value?.nextMonthDate);
  const formatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <section className="dp-h-divider">
      <div className="dp-next-bills">
        <ul className="dp-accordion">
          <li className="active">
            <Link to={`${pathname}${search}`} className="dp-accordion-thumb">
              {_('buy_process.upcoming_bills.title')}
            </Link>
            <div className="dp-accordion-panel">
              <div className="dp-accordion-content">
                <div className="dp-plan-box">
                  <h4>{_('buy_process.upcoming_bills.marketing_plan_subtitle')}</h4>
                  <hr />
                  <ul className="dp-items-result">
                    <li>
                      <p>{formatter.format(nextMonthDate)}</p>
                      <span>
                        {' '}
                        US${' '}
                        <FormattedNumber
                          value={amountDetailsData.value?.nextMonthTotal}
                          {...numberFormatOptions}
                        />
                        *
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
};
