import { BrowserRouter } from 'react-router-dom';
import { DiscountOffer } from '.';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { IntlProvider } from 'react-intl';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('DiscountOffer component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <DiscountOffer />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.cancellation.discount_offer.title')).toBeInTheDocument();
    expect(screen.getByText('my_plan.cancellation.discount_offer.description')).toBeInTheDocument();
    expect(screen.getByText('my_plan.cancellation.discount_offer.request_discount_button')).toBeInTheDocument();
    expect(screen.getByText('my_plan.cancellation.discount_offer.continue_with_cancellation_button')).toBeInTheDocument();
  });
});
