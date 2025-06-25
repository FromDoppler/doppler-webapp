import { BrowserRouter } from 'react-router-dom';
import { CustomReports } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('CustomReports component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <CustomReports />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.custom_reports.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.custom_reports.description')).toBeInTheDocument();
  });
});
