import { render, screen, act } from '@testing-library/react';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { Promocode } from './Promocode';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';
import { fakePromotion } from '../../../../services/doppler-account-plans-api-client.double';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route } from 'react-router-dom';

const dependencies = (dopplerAccountPlansApiClientDouble) => ({
  dopplerAccountPlansApiClient: dopplerAccountPlansApiClientDouble,
});

const mockedCallback = jest.fn();

const PromocodeElement = ({
  allowPromocode,
  disabled,
  planId,
  url,
  dopplerAccountPlansApiClientDouble,
}) => {
  const services = dependencies(dopplerAccountPlansApiClientDouble);

  return (
    <MemoryRouter initialEntries={[url]}>
      <Route path={'checkout/:pathType/:planType?'}>
        <AppServicesProvider forcedServices={services}>
          <IntlProvider>
            <Promocode
              allowPromocode={allowPromocode}
              disabled={disabled}
              planId={planId}
              callback={mockedCallback}
            />
          </IntlProvider>
        </AppServicesProvider>
      </Route>
    </MemoryRouter>
  );
};

describe('Promocode component', () => {
  it('should show disabled when allowPromode is "false"', async () => {
    //Arrange
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: async () => {
        return { success: true, value: fakePromotion };
      },
    };

    // Act
    render(
      <PromocodeElement
        allowPromocode={false}
        disabled={false}
        planId={1}
        url={'checkout/standard/subscribers'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
      />,
    );

    // Assert
    const promocodeInput = screen.getByRole('textbox', { name: 'promocode' });
    const validateButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.promocode_validate_button',
    });
    expect(promocodeInput).toBeDisabled();
    expect(validateButton).toBeDisabled();
  });

  it('should show messages of required fields when the promocode is empty', async () => {
    //Arrange
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: async () => {
        return { success: true, value: fakePromotion };
      },
    };

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={1}
        url={'checkout/standard/subscribers'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
      />,
    );

    // Assert
    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.promocode_validate_button',
    });
    user.click(submitButton);

    // Validation error messages should be displayed
    const validationErrorMessages = await screen.findAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(1);
  });

  it('should show a invalid message when the promocode is invalid', async () => {
    //Arrange
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: async () => {
        return { success: false, value: fakePromotion };
      },
    };

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={1}
        url={'checkout/standard/subscribers'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
      />,
    );

    // Assert
    let promocodeInput = await screen.findByRole('textbox', {
      name: 'promocode',
    });
    user.clear(promocodeInput);
    user.type(promocodeInput, 'invalidpromocode');

    promocodeInput = await screen.findByRole('textbox', {
      name: 'promocode',
    });
    expect(promocodeInput).toHaveValue('invalidpromocode');

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.promocode_validate_button',
    });
    user.click(submitButton);

    // Invalid error message should be displayed
    const invalidMessage = await screen.findAllByText(
      'checkoutProcessForm.purchase_summary.promocode_error_message',
    );
    expect(invalidMessage).toHaveLength(1);
  });

  it('should show success message when the user enters a valid promocode', async () => {
    //Arrange
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: async () => {
        return { success: true, value: fakePromotion };
      },
    };

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={1}
        url={'checkout/standard/subscribers'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
      />,
    );

    // Assert
    let promocodeInput = await screen.findByRole('textbox', {
      name: 'promocode',
    });
    user.clear(promocodeInput);
    user.type(promocodeInput, 'promocode');

    promocodeInput = await screen.findByRole('textbox', {
      name: 'promocode',
    });
    expect(promocodeInput).toHaveValue('promocode');

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.promocode_validate_button',
    });
    user.click(submitButton);

    const summarySuccessMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.promocode_success_message',
    );

    expect(summarySuccessMessage).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(mockedCallback).toBeCalledTimes(1);
  });

  it('should show success message when the promocode passed as parameter is valid', async () => {
    //Arrange
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: async () => {
        return { success: true, value: fakePromotion };
      },
    };

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={1}
        url={'checkout/standard/subscribers?PromoCode=promocode'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
      />,
    );

    // Assert
    let promocodeInput = await screen.findByRole('textbox', {
      name: 'promocode',
    });
    expect(promocodeInput).toHaveValue('promocode');

    const summarySuccessMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.promocode_success_message',
    );

    expect(summarySuccessMessage).toBeInTheDocument();
    expect(mockedCallback).toBeCalledTimes(1);
  });
});
