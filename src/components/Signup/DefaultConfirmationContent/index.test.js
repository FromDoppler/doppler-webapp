import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { DefaultConfirmationContent } from '.';

describe('DefaultConfirmationContent', () => {
  it('should render warning message when resentTimes is more than 0', async () => {
    // Arrange
    const incrementAndResend = () => {};
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 1;
    const mailtoSupport = 'mailtoSupport@mail.com';

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <DefaultConfirmationContent
            incrementAndResend={incrementAndResend}
            registeredUser={registeredUser}
            resentTimes={resentTimes}
            mailtoSupport={mailtoSupport}
          />
        </Router>
      </DopplerIntlProvider>,
    );

    // Assert
    expect(screen.getByText('signup.no_more_resend_MD_link')).toBeInTheDocument();
  });

  it('should call the incrementAndResend function if resend email button is clicked', async () => {
    // Arrange
    const incrementAndResend = jest.fn();
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 0;
    const mailtoSupport = 'mailtoSupport@mail.com';

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <DefaultConfirmationContent
            incrementAndResend={incrementAndResend}
            registeredUser={registeredUser}
            resentTimes={resentTimes}
            mailtoSupport={mailtoSupport}
          />
        </Router>
      </DopplerIntlProvider>,
    );

    // Assert
    const button = screen.getByRole('button');
    await user.click(button);
    expect(incrementAndResend).toHaveBeenCalled();
  });
});
