import { render, screen } from '@testing-library/react';
import { AppServicesProvider } from '../../../../../services/pure-di';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { Formik } from 'formik';
import { StatusMessage } from '.';
import { HAS_ERROR, SAVED } from '..';

const StatusMessageElement = ({ status }) => (
  <AppServicesProvider>
    <IntlProvider>
      <Formik initialValues={{}}>
        <StatusMessage status={status} />
      </Formik>
    </IntlProvider>
  </AppServicesProvider>
);

describe('StatusMessage component', () => {
  it('should show error message when the status has error', async () => {
    // Act
    render(<StatusMessageElement status={HAS_ERROR} />);

    screen.getByRole('alert', { name: 'cancel' });
    screen.getByText(`updatePaymentMethod.payment_method.transfer.send_email_error_message`);
  });

  it('should show error message when the status is saved', async () => {
    // Act
    render(<StatusMessageElement status={SAVED} />);

    screen.getByRole('alert', { name: 'success' });
    screen.getByText(`updatePaymentMethod.payment_method.transfer.send_email_success_message`);
  });
});
