import { useIntl } from 'react-intl';
import { thousandSeparatorNumber } from '../../../../../utils';
import { AddOnType } from '../../../../../doppler-types';

export const AddOnPlanInformation = ({ addOnType, quantity, discount }) => {
  const intl = useIntl();
  const _ = (id, values) => intl.formatMessage({ id: id }, values);

  return (
    <>
      <h4 className="dp-tit-plan-purchased">
        {_(
          `checkoutProcessSuccess.${
            addOnType === AddOnType.OnSite ? 'onsite' : 'push_notification'
          }_plan_title`,
        )}
      </h4>
      <ul className="dp-purchase-summary-list">
        <li>
          <span>{_(`checkoutProcessSuccess.plan_type`)}</span>
          <h3>
            {_(
              `checkoutProcessSuccess.${
                addOnType === AddOnType.OnSite ? 'onsite' : 'push_notification'
              }_plan_label`,
            )}
          </h3>
        </li>
        <li>
          <span>
            {_(
              `checkoutProcessSuccess.${
                addOnType === AddOnType.OnSite
                  ? 'onsite_plan_acquired_prints'
                  : 'push_notification_plan_acquired_emails'
              }`,
            )}
          </span>
          <h3>{thousandSeparatorNumber(intl.defaultLocale, quantity)}</h3>
        </li>
        <li>
          {discount ? (
            <>
              <span>
                {_(
                  `checkoutProcessSuccess.${
                    addOnType === AddOnType.OnSite ? 'onsite' : 'push_notification'
                  }_plan_billing_title`,
                )}
              </span>
              <h3>{_('checkoutProcessSuccess.discount_' + discount?.replace('-', '_'))}</h3>
            </>
          ) : (
            <>
              <span>
                {_(
                  `checkoutProcessSuccess.${
                    addOnType === AddOnType.OnSite ? 'onsite' : 'push_notification'
                  }_plan_billing_title`,
                )}
              </span>
              <h3>
                {_(
                  `checkoutProcessSuccess.${
                    addOnType === AddOnType.OnSite ? 'onsite' : 'push_notification'
                  }_plan_default_billing`,
                )}
              </h3>
            </>
          )}
        </li>
      </ul>
    </>
  );
};
