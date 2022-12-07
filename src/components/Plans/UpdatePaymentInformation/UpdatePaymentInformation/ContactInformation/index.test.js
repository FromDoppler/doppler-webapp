import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { ContactInformation } from './index';
import { BrowserRouter } from 'react-router-dom';

const dependencies = () => ({
  dopplerBillingUserApiClient: {
    sendContactInformation: async () => {
      return { success: true };
    },
  },
});

const ContactInformationElement = ({ otherDependencies }) => (
  <AppServicesProvider forcedServices={{ ...dependencies(), ...otherDependencies }}>
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

  it('should show success message to user when the form is submited', async () => {
    // Arrange
    const firstname = 'Juan';
    const lastname = 'Hoffman';
    const phone = '+54 223 655-8877';
    const email = 'hardcoded@email.com';
    const sendContactInformationMock = jest.fn(async () => {
      return { success: true };
    });

    // Act
    render(
      <ContactInformationElement
        otherDependencies={{
          dopplerBillingUserApiClient: {
            sendContactInformation: sendContactInformationMock,
          },
        }}
      />,
    );

    // Assert
    // get fields
    const firstNameField = screen.getByLabelText(
      /updatePaymentMethod.payment_method.transfer.firstname/i,
    );
    const lastNameField = screen.getByLabelText(
      /updatePaymentMethod.payment_method.transfer.lastname/i,
    );
    const phoneField = screen.getByLabelText(/updatePaymentMethod.payment_method.transfer.phone/i);
    const emailField = screen.getByLabelText(/updatePaymentMethod.payment_method.transfer.email/i);

    // fill fields
    await user.type(firstNameField, firstname);
    await user.type(lastNameField, lastname);
    phoneField.focus();
    await user.type(phoneField, phone);
    await user.type(emailField, email);

    // Click save button
    await user.click(
      screen.getByRole('button', {
        name: 'updatePaymentMethod.payment_method.transfer.send_button',
      }),
    );

    expect(sendContactInformationMock).toHaveBeenCalledWith({
      firstname,
      lastname,
      email,
      phone,
    });

    // Validation error messages should be not displayed
    const validationErrorMessages = screen.queryAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(0);

    // the submit button is hidden
    expect(
      screen.queryByRole('button', {
        name: 'updatePaymentMethod.payment_method.transfer.send_button',
      }),
    ).not.toBeInTheDocument();

    screen.getByText('updatePaymentMethod.payment_method.transfer.send_email_success_message');
  });
});
