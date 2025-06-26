import { BrowserRouter } from 'react-router-dom';
import { LandingPages } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('LandingPages component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <LandingPages />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.landing_pages.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.landing_pages.description')).toBeInTheDocument();
  });
});
