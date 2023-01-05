import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { DefaultConfirmationContent } from './DefaultConfirmationContent';

describe('DefaultConfirmationContent', () => {
  it('should render warning message when resentTimes is more than 0', async () => {
    // Arrange
    const incrementAndResend = () => {};
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 1;
    const mailtoSupport = 'mailtoSupport@mail.com';
    const Captcha = () => null;

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <DefaultConfirmationContent
            incrementAndResend={incrementAndResend}
            registeredUser={registeredUser}
            resentTimes={resentTimes}
            mailtoSupport={mailtoSupport}
            Captcha={Captcha}
          />
        </Router>
      </DopplerIntlProvider>,
    );

    // Assert
    expect(screen.queryByTestId('warning-message')).toBeInTheDocument();
  });

  it('should render the user email', async () => {
    // Arrange
    const incrementAndResend = () => {};
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 1;
    const mailtoSupport = 'mailtoSupport@mail.com';
    const Captcha = () => null;

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <DefaultConfirmationContent
            incrementAndResend={incrementAndResend}
            registeredUser={registeredUser}
            resentTimes={resentTimes}
            mailtoSupport={mailtoSupport}
            Captcha={Captcha}
          />
        </Router>
      </DopplerIntlProvider>,
    );

    // Assert
    expect(screen.getByText(registeredUser)).toBeInTheDocument();
  });
});
