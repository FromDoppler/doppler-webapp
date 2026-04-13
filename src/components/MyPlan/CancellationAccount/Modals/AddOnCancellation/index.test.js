import { BrowserRouter } from 'react-router-dom';
import { AddOnCancellationModal } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('AddOnCancellationModal component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <AddOnCancellationModal />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.cancellation.addon_modal.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.cancellation.addon_modal.description')).toBeInTheDocument();
  });
});
