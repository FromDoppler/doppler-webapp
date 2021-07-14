import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AuthorizationForm } from './AuthorizationForm';

describe('AuthorizationForm ', () => {
  it('should render the empty input', () => {
    // Act
    render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );

    // Assert
    const input = screen.getByRole('textbox');
    expect(input.value).toBe('');
  });

  it('should not show added emails when it has no initial values', () => {
    // Act
    render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.queryByRole('button', { name: 'big_query.plus_button_remove' }),
    ).not.toBeInTheDocument();
  });

  it('should show added emails when it has initial values', () => {
    //Arrange
    const emails = ['email1@gmail.com', 'email2@gmail.com', 'email3@gmail.com'];

    // Act
    render(
      <IntlProvider>
        <AuthorizationForm emails={emails} />
      </IntlProvider>,
    );

    // Assert
    emails.forEach((email) => {
      expect(screen.getByText(email)).toBeInTheDocument();
    });
  });

  test('Validate button disabled when input is empty', () => {
    // Arrange
    const { container } = render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );

    // Assert
    const buttonAdd = container.querySelector('button[type="button"]');
    expect(buttonAdd).toBeDisabled();
  });

  test('Validate button enabled when input is not empty', () => {
    // Arrange
    const { container } = render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );

    // Act
    const emptyInput = document.querySelector('input[type="email"]');
    fireEvent.change(emptyInput, { target: { value: 'input not empty' } });

    // Assert
    const buttonAdd = container.querySelector('button[type="button"]');
    expect(buttonAdd).toBeEnabled();
  });

  test('Validate error message when input not is email ', () => {
    // Arrange
    const { container } = render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );
    const emptyInput = document.querySelector('input[type="email"]');
    fireEvent.change(emptyInput, { target: { value: 'not is email' } });
    const buttonAdd = container.querySelector('button[type="button"]');
    expect(buttonAdd).toBeEnabled();

    // Act
    fireEvent.click(buttonAdd);

    //Assert
    const { getByText } = render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );
    expect(getByText('validation_messages.error_invalid_email_address')).toBeInTheDocument();
  });

  test('Validate error message when input has accents', () => {
    // Arrange
    const { container } = render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );

    const emptyInput = document.querySelector('input[type="email"]');
    fireEvent.change(emptyInput, { target: { value: 'acentó@gmail.com' } });
    const buttonAdd = container.querySelector('button[type="button"]');
    expect(buttonAdd).toBeEnabled();

    // Act
    fireEvent.click(buttonAdd);

    // Assert
    const { getByText } = render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );
    expect(getByText('validation_messages.error_has_accents')).toBeInTheDocument();
  });

  test('Validate error message when email is duplicate', async () => {
    // Arrange
    const { container } = render(
      <IntlProvider>
        <AuthorizationForm emails={[]} />
      </IntlProvider>,
    );

    await waitFor(() => {
      setTimeout(function () {
        expect(container.getElementsByClassName('loading-box').length).toBe(0);
        const emptyInput = document.querySelector('input[type="email"]');
        fireEvent.change(emptyInput, { target: { value: 'email1@gmail.com' } });
        const buttonAdd = container.querySelector('button[type="button"]');
        expect(buttonAdd).toBeEnabled();

        //Act
        fireEvent.click(buttonAdd);

        //Assert
        const { getByText } = render(
          <IntlProvider>
            <AuthorizationForm emails={[]} />
          </IntlProvider>,
        );
        expect(getByText('big_query.plus_error_message_email_exists')).toBeInTheDocument();
      }, 5000);
    });
  });
});
