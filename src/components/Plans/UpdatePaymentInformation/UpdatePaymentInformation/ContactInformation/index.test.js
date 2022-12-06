import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { ContactInformation } from './index';

const dependencies = () => ({
  dopplerBillingUserApiClient: {
    sendContactInformation: async () => {
      return { success: true };
    },
  },
});

const ContactInformationElement = () => (
  <AppServicesProvider forcedServices={dependencies()}>
    <IntlProvider>
      <BrowserRouter>
        <ContactInformation />
      </BrowserRouter>
    </IntlProvider>
  </AppServicesProvider>
);

describe('ContactInformation component', () => {
  it('should show messages for empty required fields', async () => {
    // Act
    render(<ContactInformationElement />);

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'updatePaymentMethod.payment_method.transfer.send_button',
    });
    await user.click(submitButton);

    // Validation error messages should be displayed
    const validationErrorMessages = await screen.findAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(4);
  });
});
