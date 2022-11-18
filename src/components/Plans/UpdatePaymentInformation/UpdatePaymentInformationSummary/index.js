import { InjectAppServices } from '../../../../services/pure-di';
import { useIntl } from 'react-intl';
import { useQueryParams } from '../../../../hooks/useQueryParams';
import HeaderSection from '../../../shared/HeaderSection/HeaderSection';
import { Helmet } from 'react-helmet';
import { UpdatePaymentInformationSummaryTitle } from './UpdatePaymenInformationSummaryTitle';

export const PaymentInformationSummary = InjectAppServices(
  (
    {
      //dependencies: { dopplerBillingUserApiClient, dopplerAccountPlansApiClient, appSessionRef },
      //location,
    },
  ) => {
    const query = useQueryParams();
    const paymentMethodType = query.get('paymentMethod') ?? '';
    //const paymentPending = query.get('paymentPending') ?? '';
    const allInvoicesProcessed = query.get('allInvoicesProcessed') ?? '';
    const unlockAccount = query.get('unlockAccount') ?? '';
    const intl = useIntl();
    const _ = (id, values) => intl.formatMessage({ id: id }, values);

    return (
      <>
        <Helmet>
          <title>{_('updatePaymentInformationSuccess.title')}</title>
          <meta name="checkout-success" />
        </Helmet>
        <HeaderSection>
          <UpdatePaymentInformationSummaryTitle />
        </HeaderSection>
        <section className="dp-container m-b-24">
          <p>
            {allInvoicesProcessed
              ? _('updatePaymentInformationSuccess.all_invoices_processed')
              : _('updatePaymentInformationSuccess.not_all_invoices_processed')}
          </p>
          <p>
            {_('updatePaymentInformationSuccess.unlock_account_message')}
          </p>
          <a href={'/login'} className="dp-button button-medium primary-green m-t-24">
            {_('updatePaymentInformationSuccess.go_to_login_button')}
          </a>
        </section>
      </>
    );
  },
);

export default InjectAppServices(PaymentInformationSummary);
