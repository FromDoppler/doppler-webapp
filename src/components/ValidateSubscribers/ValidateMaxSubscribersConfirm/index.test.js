import { render, screen } from '@testing-library/react';
import { ValidateMaxSubscribersConfirmation } from '.';
import { AppServicesProvider } from '../../../services/pure-di';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import userEvent from '@testing-library/user-event';

describe('ValidateMaxSubscribersConfirm', () => {
  it('should call handleClose when button is clicked', async () => {
    // Arrange
    const handleClose = jest.fn();

    // Act
    render(
      <AppServicesProvider>
        <DopplerIntlProvider>
          <ValidateMaxSubscribersConfirmation handleClose={handleClose} />
        </DopplerIntlProvider>
      </AppServicesProvider>,
    );
    const button = await screen.getByRole('button', {
      name: 'validate_max_subscribers_form.button_accept',
    });
    userEvent.click(button);

    // Assert
    expect(handleClose).toBeCalledTimes(1);
  });
});
