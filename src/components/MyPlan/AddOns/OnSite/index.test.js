import { BrowserRouter } from 'react-router-dom';
import { OnSite } from '.';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('OnSite component', () => {
  it('should render component', () => {
    // Assert
    const onsite = {
      buttonText: 'COMENZAR',
      buttonUrl: '',
    };

    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <OnSite onSite={onsite} />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.addons.onsite.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.addons.onsite.description')).toBeInTheDocument();
  });
});
