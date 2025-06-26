import { BrowserRouter } from 'react-router-dom';
import { DedicatedEnvironment } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('DedicatedEnvironment component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <DedicatedEnvironment />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.dedicated_environment.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.addons.dedicated_environment.description'),
    ).toBeInTheDocument();
  });
});
