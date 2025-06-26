import { BrowserRouter } from 'react-router-dom';
import { TransactionalEmails } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('TransactionalEmails component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <TransactionalEmails />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.transactional_emails.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.transactional_emails.description')).toBeInTheDocument();
  });
});
