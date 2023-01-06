import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { DynamicConfirmationContent } from '.';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('DynamicConfirmationContent', () => {
  it('should render the contentActivation', async () => {
    // Arrange
    const contentActivation =
      "<h1>Check your email</h1><p>Enter <strong>{{useremail}}</strong> to validate ir.</p><p>With this email you will access your new <strong>Doppler</strong> account.</p><div class='separator-line'></div><p class='confirmation-main__p-2 confirmation-main__p-2--italic'>Do you have doubts? <a>Contact us</a> and we will help you</p><div class='confirmationPage__main__separator'><img src='https://www.fromdoppler.com/img/confirmation-page/separator.png' alt='separator'></div><p id='resend-email-p'>If you didn’t receive the email, <button id='resend-email' class='dp-button link-green'>request resend.</button>";
    const incrementAndResend = () => {};
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 0;
    const mailtoSupport = 'mailtoSupport@mail.com';

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <DynamicConfirmationContent
            contentActivation={contentActivation}
            registeredUser={registeredUser}
            incrementAndResend={incrementAndResend}
            mailtoSupport={mailtoSupport}
            resentTimes={resentTimes}
          />
        </Router>
      </DopplerIntlProvider>,
    );

    // Assert
    expect(screen.getByText(registeredUser)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should succesfully attach the functionallity to the button', async () => {
    // Arrange
    const contentActivation =
      "<h1>Check your email</h1><p>Enter <strong>{{useremail}}</strong> to validate ir.</p><p>With this email you will access your new <strong>Doppler</strong> account.</p><div class='separator-line'></div><p class='confirmation-main__p-2 confirmation-main__p-2--italic'>Do you have doubts? <a>Contact us</a> and we will help you</p><div class='confirmationPage__main__separator'><img src='https://www.fromdoppler.com/img/confirmation-page/separator.png' alt='separator'></div><p id='resend-email-p'>If you didn’t receive the email, <button id='resend-email' class='dp-button link-green'>request resend.</button>";
    const incrementAndResend = jest.fn();
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 0;
    const mailtoSupport = 'mailtoSupport@mail.com';

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <DynamicConfirmationContent
            contentActivation={contentActivation}
            registeredUser={registeredUser}
            incrementAndResend={incrementAndResend}
            mailtoSupport={mailtoSupport}
            resentTimes={resentTimes}
          />
        </Router>
      </DopplerIntlProvider>,
    );

    // Assert
    let button = screen.getByRole('button');
    await user.click(button);
    expect(incrementAndResend).toHaveBeenCalled();
  });

  it('should succesfully show the warning message', async () => {
    // Arrange
    const contentActivation =
      "<h1>Check your email</h1><p>Enter <strong>{{useremail}}</strong> to validate ir.</p><p>With this email you will access your new <strong>Doppler</strong> account.</p><div class='separator-line'></div><p class='confirmation-main__p-2 confirmation-main__p-2--italic'>Do you have doubts? <a>Contact us</a> and we will help you</p><div class='confirmationPage__main__separator'><img src='https://www.fromdoppler.com/img/confirmation-page/separator.png' alt='separator'></div><p id='resend-email-p'>If you didn’t receive the email, <button id='resend-email' class='dp-button link-green'>request resend.</button>";
    const incrementAndResend = jest.fn();
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 1;
    const mailtoSupport = 'mailtoSupport@mail.com';

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <DynamicConfirmationContent
            contentActivation={contentActivation}
            registeredUser={registeredUser}
            incrementAndResend={incrementAndResend}
            mailtoSupport={mailtoSupport}
            resentTimes={resentTimes}
          />
        </Router>
      </DopplerIntlProvider>,
    );

    // Assert
    expect(screen.getByText('signup.no_more_resend_MD_link')).toBeInTheDocument();
  });
});
