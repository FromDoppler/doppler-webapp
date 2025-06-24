import { BrowserRouter } from 'react-router-dom';
import { AdditionalServices } from '.';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider';
import { AppServicesProvider } from '../../../services/pure-di';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('AdditionalServices component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <AdditionalServices />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Servicios Adicionales')).toBeInTheDocument();
  });
});
