import { render, screen, act } from '@testing-library/react';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { InvoiceRecipients } from './InvoiceRecipients';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';

const mockedOnSubmit = jest.fn();

const InvoiceRecipientsElement = ({ emails, viewOnly }) => {
  return (
    <AppServicesProvider>
      <IntlProvider>
        <InvoiceRecipients emails={emails} viewOnly={viewOnly} onSubmit={mockedOnSubmit} />
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('InvoiceRecipients component', () => {
  it('readonly view - should show the invoice emails separated by comma', async () => {
    //Arrange
    const emails = ['mail1@test.com', 'mail2@test.com'];

    // Act
    render(<InvoiceRecipientsElement emails={emails} viewOnly={true} />);

    // Assert
    const emailsSeparatedByComma = emails.join(', ');
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.edit_add_recipients_button',
    });

    expect(submitButton).toBeInTheDocument();
    expect(screen.getByText(emailsSeparatedByComma)).toBeInTheDocument();
  });

  it('edit view - should not show tag cloud', () => {
    // Arrange
    const emails = [];

    // Act
    render(<InvoiceRecipientsElement emails={emails} viewOnly={false} />);

    // Assert
    expect(screen.queryByRole('list', { name: 'cloud tags' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox').value).toBe('');
  });

  it('edit view - should show the tag cloud with the initial values', () => {
    // Arrange
    const emails = ['harcode_1@mail.com', 'harcode_2@mail.com'];

    // Act
    render(<InvoiceRecipientsElement emails={emails} viewOnly={false} />);

    // Assert
    const cloudTags = screen.getByRole('list', { name: 'cloud tags' });
    expect(cloudTags).toBeInTheDocument();
    expect(cloudTags.querySelectorAll('li').length).toBe(emails.length);
    expect(screen.getByRole('textbox').value).toBe('');
  });

  it('edit view - should add tags when passing validations and submit form', async () => {
    // Arrange
    const tagToAdd1 = 'harcode_1@mail.com';
    const invalidTag = 'harcode_fail';
    const tagToAdd2 = 'harcode_2@mail.com';
    const emails = [];

    // Act
    render(<InvoiceRecipientsElement emails={emails} viewOnly={false} />);

    // Assert
    const getCloudTags = () => screen.queryByRole('list', { name: 'cloud tags' });
    const getErrors = () => screen.queryByRole('alert');

    let cloudTags = getCloudTags();
    let errors;
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: 'add tag' });
    expect(getCloudTags()).not.toBeInTheDocument();
    expect(input.value).toBe('');

    // add first tag
    userEvent.type(input, tagToAdd1);
    userEvent.click(addButton);
    cloudTags = getCloudTags();
    errors = getErrors();
    expect(cloudTags).toBeInTheDocument();
    expect(errors).not.toBeInTheDocument();

    // emails.length + 1 because the first tag was added
    expect(cloudTags.querySelectorAll('li').length).toBe(emails.length + 1);

    // fails when add second tag (simulated with enter event)
    userEvent.type(input, invalidTag);
    userEvent.type(input, '{enter}');
    cloudTags = getCloudTags();
    errors = getErrors();

    // the same amount of tag is kept because it was not added
    expect(cloudTags.querySelectorAll('li').length).toBe(emails.length + 1);
    expect(errors).toBeInTheDocument();

    // success when add second tag (simulated with enter event)
    userEvent.clear(input);
    userEvent.type(input, tagToAdd2);
    userEvent.type(input, '{enter}');
    cloudTags = getCloudTags();
    errors = getErrors();

    // emails.length+2 because the second tag was added
    expect(cloudTags.querySelectorAll('li').length).toBe(emails.length + 2);
    expect(errors).not.toBeInTheDocument();
  });

  it('edit view - should call onSubmit function if the submit was succesfully', async () => {
    // Arrange
    const tagToAdd1 = 'harcode_1@mail.com';
    const emails = [];

    // Act
    render(<InvoiceRecipientsElement emails={emails} viewOnly={false} />);

    // Assert
    const getCloudTags = () => screen.queryByRole('list', { name: 'cloud tags' });
    const getErrors = () => screen.queryByRole('alert');

    let cloudTags = getCloudTags();
    let errors;
    const input = screen.getByRole('textbox');
    const addButton = screen.getByRole('button', { name: 'add tag' });
    expect(getCloudTags()).not.toBeInTheDocument();
    expect(input.value).toBe('');

    // add first tag
    userEvent.type(input, tagToAdd1);
    userEvent.click(addButton);
    cloudTags = getCloudTags();
    errors = getErrors();
    expect(cloudTags).toBeInTheDocument();
    expect(errors).not.toBeInTheDocument();

    // emails.length + 1 because the first tag was added
    expect(cloudTags.querySelectorAll('li').length).toBe(emails.length + 1);
    expect(errors).not.toBeInTheDocument();

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.edit_add_recipients_confirmation_button',
    });
    await act(async () => userEvent.click(submitButton));
    expect(mockedOnSubmit).toBeCalledTimes(1);
  });
});
