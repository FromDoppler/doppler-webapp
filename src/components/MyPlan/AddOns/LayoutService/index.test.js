import { BrowserRouter } from 'react-router-dom';
import { LayoutService } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('LayoutService component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <LayoutService />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.layout_service.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.layout_service.description')).toBeInTheDocument();
  });
});
