import { render, screen, act } from '@testing-library/react';
import { AppServicesProvider } from '../../../../services/pure-di';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { Promocode } from './Promocode';
import '@testing-library/jest-dom/extend-expect';
import user from '@testing-library/user-event';
import { fakePromotion } from '../../../../services/doppler-account-plans-api-client.double';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const dependencies = (dopplerAccountPlansApiClientDouble) => ({
  dopplerAccountPlansApiClient: dopplerAccountPlansApiClientDouble,
});

const getPromoCodeField = () =>
  screen.findByRole('textbox', {
    name: 'promocode',
  });

const PromocodeElement = ({
  allowPromocode,
  disabled,
  planId,
  url,
  dopplerAccountPlansApiClientDouble,
  mockedCallback,
}) => {
  const services = dependencies(dopplerAccountPlansApiClientDouble);

  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <MemoryRouter initialEntries={[url]}>
          <Routes>
            <Route
              path={'/checkout/:pathType/:planType'}
              element={
                <Promocode
                  allowPromocode={allowPromocode}
                  disabled={disabled}
                  planId={planId}
                  callback={mockedCallback}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    </AppServicesProvider>
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
        url={'/checkout/standard/subscribers'}
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
    const validatePromocodeMock = jest.fn(async () => {
      return { success: false, value: fakePromotion };
    });
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: validatePromocodeMock,
    };

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={1}
        url={'/checkout/standard/subscribers'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
      />,
    );

    // Assert
    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.promocode_validate_button',
    });
    await act(() => user.click(submitButton));

    // Validation error messages should be displayed
    const validationErrorMessages = await screen.findAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(1);
    expect(validatePromocodeMock).not.toHaveBeenCalled();
  });

  it('should show a invalid message when the promocode is invalid', async () => {
    //Arrange
    const validatePromocodeMock = jest.fn(async () => {
      return { success: false, value: fakePromotion };
    });

    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: validatePromocodeMock,
    };
    const mockedCallback = jest.fn();
    const planId = 1;
    const fakePromoCode = 'invalidpromocode';

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={planId}
        url={'/checkout/standard/subscribers'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        mockedCallback={mockedCallback}
      />,
    );

    // Assert
    let promocodeInput = await getPromoCodeField();
    await act(() => user.clear(promocodeInput));
    await act(() => user.type(promocodeInput, fakePromoCode));

    promocodeInput = await getPromoCodeField();
    expect(promocodeInput).toHaveValue(fakePromoCode);

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.promocode_validate_button',
    });
    await act(() => user.click(submitButton));

    // Invalid error message should be displayed
    const invalidMessage = await screen.findAllByText(
      'checkoutProcessForm.purchase_summary.promocode_error_message',
    );
    expect(invalidMessage).toHaveLength(1);
    expect(validatePromocodeMock).toHaveBeenCalledWith(planId, fakePromoCode);
    expect(mockedCallback).not.toHaveBeenCalled();
  });

  it('should show success message when the user enters a valid promocode', async () => {
    //Arrange
    const validatePromocodeMock = jest.fn(async () => {
      return { success: true, value: fakePromotion };
    });
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: validatePromocodeMock,
    };
    const mockedCallback = jest.fn();
    const planId = 1;
    const fakePromocode = 'promocode';

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={planId}
        url={'/checkout/standard/subscribers'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        mockedCallback={mockedCallback}
      />,
    );

    // Assert
    let promocodeInput = await getPromoCodeField();
    await act(() => user.clear(promocodeInput));
    await act(() => user.type(promocodeInput, fakePromocode));

    promocodeInput = await getPromoCodeField();
    expect(promocodeInput).toHaveValue(fakePromocode);

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.purchase_summary.promocode_validate_button',
    });
    await act(() => user.click(submitButton));

    const summarySuccessMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.promocode_success_message',
    );

    expect(summarySuccessMessage).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(validatePromocodeMock).toHaveBeenCalledWith(planId, fakePromocode);
    expect(mockedCallback).toHaveBeenCalledWith({ ...fakePromotion, promocode: fakePromocode });
  });

  it('should show success message when the promocode passed as parameter is valid', async () => {
    //Arrange
    const validatePromocodeMock = jest.fn(async () => {
      return { success: true, value: fakePromotion };
    });
    const dopplerAccountPlansApiClientDouble = {
      validatePromocode: validatePromocodeMock,
    };
    const mockedCallback = jest.fn();
    const planId = 1;
    const fakePromocode = 'promocode';

    // Act
    render(
      <PromocodeElement
        allowPromocode={true}
        disabled={false}
        planId={planId}
        url={'/checkout/standard/subscribers?PromoCode=promocode'}
        dopplerAccountPlansApiClientDouble={dopplerAccountPlansApiClientDouble}
        mockedCallback={mockedCallback}
      />,
    );

    // Assert
    let promocodeInput = await getPromoCodeField();
    expect(promocodeInput).toHaveValue(fakePromocode);

    const summarySuccessMessage = await screen.findByText(
      'checkoutProcessForm.purchase_summary.promocode_success_message',
    );

    expect(summarySuccessMessage).toBeInTheDocument();
    expect(validatePromocodeMock).toHaveBeenCalledWith(planId, fakePromocode);
    expect(mockedCallback).toHaveBeenCalledWith({ ...fakePromotion, promocode: fakePromocode });
  });
});
