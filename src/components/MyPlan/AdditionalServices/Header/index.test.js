import { BrowserRouter } from 'react-router-dom';
import { AdditionalServicesHeader } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('Header component', () => {
  it('should render component', () => {
    // Act
    render(
      <BrowserRouter>
        <IntlProvider>
          <AdditionalServicesHeader />
        </IntlProvider>
      </BrowserRouter>,
    );

    // Assert
    expect(screen.getByText('my_plan.addtional_services.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addtional_services.description')).toBeInTheDocument();
  });
});
