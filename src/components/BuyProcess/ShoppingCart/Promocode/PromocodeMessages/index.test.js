import { PromocodeMessages } from '.';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { IntlProvider } from 'react-intl';

describe('PromocodeMessages component', () => {
  it('should render PromocodeMessages with not allow promocode component', async () => {
    // Arrange
    const promotion = {
      canApply: false,
      idUserTypePlan: 0,
    };
    const allowPromocode = false;

    // Act
    render(
      <IntlProvider>
        <PromocodeMessages
          promotion={promotion}
          allowPromocode={allowPromocode}
          hasPromocodeAppliedItem={true}
        />,
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.getByText('El uso de código de descuento es valido solamente con el pago mensual.'),
    ).toBeInTheDocument();
  });

  it('should render PromocodeMessages with not apply promocode for all plans component', async () => {
    // Arrange
    const promotion = {
      canApply: false,
      idUserTypePlan: 0,
      planPromotions: [
        {
          quantity: '0',
          planType: 4,
        },
      ],
    };

    const user = {
      lang: 'es',
    };

    const allowPromocode = true;

    // Act
    render(
      <IntlProvider>
        <PromocodeMessages promotion={promotion} allowPromocode={allowPromocode} user={user} />,
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.getByText(
        'checkoutProcessForm.purchase_summary.promocode_can_not_apply_error_all_plan_item_message',
      ),
    ).toBeInTheDocument();
  });

  it('should render PromocodeMessages with not apply promocode for a particular plan component', async () => {
    // Arrange
    const promotion = {
      canApply: false,
      idUserTypePlan: 1,
      planPromotions: [
        {
          quantity: '1',
          planType: 4,
        },
      ],
    };

    const user = {
      lang: 'es',
    };

    const allowPromocode = true;

    // Act
    render(
      <IntlProvider>
        <PromocodeMessages promotion={promotion} allowPromocode={allowPromocode} user={user} />,
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.getByText(
        'checkoutProcessForm.purchase_summary.promocode_can_not_apply_error_plan_item_message',
      ),
    ).toBeInTheDocument();
  });
});
