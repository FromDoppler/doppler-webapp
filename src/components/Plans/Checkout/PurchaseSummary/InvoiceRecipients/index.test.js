import '@testing-library/jest-dom/extend-expect';
import {
  getAllByRole,
  getByText,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvoiceRecipients } from '.';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';

const appSessionRef = {
  current: {
    userData: {
      user: {
        fullname: 'Cecilia Bernat',
      },
    },
  },
};

describe('InvoiceRecipients component', () => {
  it('should add recipients', async () => {
    //Arrange
    const selectedPlan = 1;
    const updateInvoiceRecipientsMock = jest.fn(async () => ({
      success: true,
    }));
    const recipients = ['mail1@test.com'];
    const dependencies = {
      appSessionRef,
      dopplerBillingUserApiClient: {
        getInvoiceRecipientsData: async () => ({
          success: true,
          value: { recipients },
        }),
        updateInvoiceRecipients: updateInvoiceRecipientsMock,
      },
    };
    const email2 = 'mail2@test.com';
    const email3 = 'mail3@test.com';

    // Act
    render(
      <AppServicesProvider forcedServices={dependencies}>
        <IntlProvider>
          <InvoiceRecipients viewOnly={true} selectedPlan={selectedPlan} />
        </IntlProvider>
      </AppServicesProvider>,
    );

    // Assert
    const getEditModeButton = () =>
      screen.queryByRole('button', {
        name: 'checkoutProcessForm.purchase_summary.edit_add_recipients_button',
      });
    const getRecipientsAdded = (cloudTags) => getAllByRole(cloudTags, 'listitem');

    const initialRecipients = recipients.join(', ');
    expect(await screen.findByText(initialRecipients)).toBeInTheDocument();
    expect(getEditModeButton()).toBeInTheDocument();
    // The form is not displayed because it is in reading mode
    expect(screen.queryByRole('form')).not.toBeInTheDocument();

    // simulate click a edit button
    userEvent.click(getEditModeButton());
    expect(getEditModeButton()).not.toBeInTheDocument();
    expect(screen.queryByRole('form')).toBeInTheDocument();
    const addButton = screen.getByRole(`button`, { name: 'add tag' });
    expect(addButton).toBeInTheDocument();

    const cloudTags = screen.queryByRole('list', { name: 'cloud tags' });
    getByText(getRecipientsAdded(cloudTags)[0], recipients[0]);

    // simulate add a tag
    const emailField = screen.getByPlaceholderText(
      'checkoutProcessForm.purchase_summary.add_recipient_placeholder',
    );
    userEvent.type(emailField, email2);
    userEvent.click(addButton);
    expect(getByText(getRecipientsAdded(cloudTags)[1], email2)).toBeInTheDocument();

    // simulate add other tag
    userEvent.type(emailField, email3);
    userEvent.click(addButton);
    expect(getByText(getRecipientsAdded(cloudTags)[2], email3)).toBeInTheDocument();

    // simulate update recipients
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.edit_add_recipients_confirmation_button',
    });
    await userEvent.click(submitButton);
    await waitForElementToBeRemoved(screen.queryByRole('form'));
    expect(await screen.findByText([...recipients, email2, email3].join(', '))).toBeInTheDocument();
    expect(getEditModeButton()).toBeInTheDocument();
    expect(updateInvoiceRecipientsMock).toHaveBeenCalled();
    expect(updateInvoiceRecipientsMock).toHaveBeenCalledWith(
      [...recipients, email2, email3],
      selectedPlan,
    );
  });
});
