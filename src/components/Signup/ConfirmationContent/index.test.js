import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfirmationContent } from '.';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('ConfirmationContent', () => {
  it('should render the contentActivation passed by props', async () => {
    // Arrange
    //const contentActivation = "<h1>Revisa tu email</h1><p>Ingresa a <strong>{{useremail}}</strong> para validarlo.</p><p>Con este email accederás a tu nueva cuenta en <strong>Doppler</strong>.</p><div class='separator-line'></div><p class='confirmation-main__p-2 confirmation-main__p-2--italic'>¿Tienes dudas? <a href='https://www.fromdoppler.com/es/contacto/?utm_source=direct' target='_blank'>Contáctanos</a> y te ayudaremos</p><div class='confirmationPage__main__separator'><img src='https://www.fromdoppler.com/img/confirmation-page/separator.png' alt='separator'></div><p id='resend-email-p'> Si no recibiste el correo, <button id='resend-email' class='dp-button link-green'>solicita el reenvío</button>";
    const contentActivation = '<h1>Test text</h1>';
    const incrementAndResend = () => {};
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 0;
    const mailtoSupport = 'mailtoSupport@mail.com';

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <ConfirmationContent
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
    expect(screen.getByText('Test text')).toBeInTheDocument();
  });

  it('should succesfully replace the key {{useremail}} for the user email', async () => {
    // Arrange
    const contentActivation =
      "<h1>Revisa tu email</h1><p>Ingresa a <strong>{{useremail}}</strong> para validarlo.</p><p>Con este email accederás a tu nueva cuenta en <strong>Doppler</strong>.</p><div class='separator-line'></div><p class='confirmation-main__p-2 confirmation-main__p-2--italic'>¿Tienes dudas? <a href='https://www.fromdoppler.com/es/contacto/?utm_source=direct' target='_blank'>Contáctanos</a> y te ayudaremos</p><div class='confirmationPage__main__separator'><img src='https://www.fromdoppler.com/img/confirmation-page/separator.png' alt='separator'></div><p id='resend-email-p'> Si no recibiste el correo, <button id='resend-email' class='dp-button link-green'>solicita el reenvío</button>";
    const incrementAndResend = () => {};
    const registeredUser = 'harcodedUser@mail.com';
    const resentTimes = 0;
    const mailtoSupport = 'mailtoSupport@mail.com';

    // Act
    render(
      <DopplerIntlProvider>
        <Router>
          <ConfirmationContent
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
  });
});
