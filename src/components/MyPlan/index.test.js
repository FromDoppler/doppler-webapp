import { BrowserRouter } from 'react-router-dom';
import { MyPlan } from '.';
import { AppServicesProvider } from '../../services/pure-di';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('OnSite component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <DopplerIntlProvider>
            <MyPlan />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('Mi Plan')).toBeInTheDocument();
  });
});
