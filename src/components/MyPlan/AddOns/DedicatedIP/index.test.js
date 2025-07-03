import { BrowserRouter } from 'react-router-dom';
import { DedicatedIP } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('DedicatedIP component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <DedicatedIP />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.dedicated_ip.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.dedicated_ip.description')).toBeInTheDocument();
  });
});
