import '@testing-library/jest-dom/extend-expect';
import { getAllByRole, getByText, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InvoiceRecipients } from '.';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';

const appSessionRef = {
  current: {
    userData: {
      user: {
        fullname: 'Cecilia Bernat',
        email: 'mail1@test.com',
      },
    },
  },
};

const matchTags = (cloudTags, currentTags) => {
  let tag = cloudTags.firstChild;
  currentTags.forEach((email) => {
    expect(tag).toHaveTextContent(email);
    tag = tag.nextSibling;
  });
};

describe('InvoiceRecipients component', () => {
  it('should add recipients', async () => {
    //Arrange
    const selectedPlan = 1;
    const updateInvoiceRecipientsMock = jest.fn(async () => ({
      success: true,
    }));
    const recipients = [];
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
        name: 'edit or add recipients',
      });
    const getRecipientsAdded = (cloudTags) => getAllByRole(cloudTags, 'listitem');

    // Because when there are no recipients added, the user email is used
    expect(await screen.findByText(appSessionRef.current.userData.user.email)).toBeInTheDocument();
    expect(getEditModeButton()).toBeInTheDocument();
    // The form is not displayed because it is in reading mode
    expect(screen.queryByRole('form')).not.toBeInTheDocument();

    // simulate click a edit button
    await act(() => userEvent.click(getEditModeButton()));
    expect(getEditModeButton()).not.toBeInTheDocument();
    expect(screen.queryByRole('form')).toBeInTheDocument();
    const addButton = screen.getByRole(`button`, { name: 'add tag' });
    expect(addButton).toBeInTheDocument();

    const cloudTags = screen.queryByRole('list', { name: 'cloud tags' });
    getByText(getRecipientsAdded(cloudTags)[0], appSessionRef.current.userData.user.email);

    // simulate add a tag
    const emailField = screen.getByPlaceholderText(
      'checkoutProcessForm.purchase_summary.add_recipient_placeholder',
    );
    await act(() => userEvent.type(emailField, email2));
    await act(() => userEvent.click(addButton));
    expect(getByText(getRecipientsAdded(cloudTags)[1], email2)).toBeInTheDocument();

    // simulate add other tag
    await act(() => userEvent.type(emailField, email3));
    await act(() => userEvent.click(addButton));
    expect(getByText(getRecipientsAdded(cloudTags)[2], email3)).toBeInTheDocument();

    // simulate update recipients
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.edit_add_recipients_confirmation_button',
    });
    await act(() => userEvent.click(submitButton));
    expect(screen.queryByRole('form')).not.toBeInTheDocument();

    const cloudTagsAdded = screen.getByRole('list', { name: 'cloud tags' });
    matchTags(cloudTagsAdded, [appSessionRef.current.userData.user.email, email2, email3]);

    expect(getEditModeButton()).toBeInTheDocument();
    expect(updateInvoiceRecipientsMock).toHaveBeenCalled();
    expect(updateInvoiceRecipientsMock).toHaveBeenCalledWith(
      [appSessionRef.current.userData.user.email, email2, email3],
      selectedPlan,
    );
  });
});
