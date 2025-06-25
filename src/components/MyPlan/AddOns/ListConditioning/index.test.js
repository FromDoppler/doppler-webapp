import { BrowserRouter } from 'react-router-dom';
import { ListConditioning } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('ListConditioning component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <ListConditioning />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.list_conditioning.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.list_conditioning.description')).toBeInTheDocument();
  });
});
