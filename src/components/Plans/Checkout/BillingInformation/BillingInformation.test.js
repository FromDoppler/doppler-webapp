import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { fakeStates } from '../../../../services/static-data-client.double';
import { BillingInformation } from './BillingInformation';
import {
  fakeBillingInformation,
  fakeBillingInformationWithEmptyData,
} from '../../../../services/doppler-billing-user-api-client.double';
import { fakeContactInformation } from '../../../../services/doppler-user-api-client.double';

const getBillingInformation = (withEmptyData, useContactInformationAsBilling) => {
  if (withEmptyData) {
    if (useContactInformationAsBilling) {
      return fakeBillingInformationWithEmptyData;
    }
    return {
      ...fakeBillingInformationWithEmptyData,
      sameAddressAsContact: false,
    };
  }
  return fakeBillingInformation;
};

const dependencies = (withEmptyData, useContactInformationAsBilling = true) => ({
  dopplerUserApiClient: {
    getContactInformationData: async () => {
      return { success: true, value: fakeContactInformation };
    },
  },
  dopplerBillingUserApiClient: {
    getBillingInformationData: async () => {
      return {
        success: true,
        value: getBillingInformation(withEmptyData, useContactInformationAsBilling),
      };
    },
    updateBillingInformation: async (values) => {
      return Promise.resolve({ success: true });
    },
  },
  staticDataClient: {
    getStatesData: async (country, language) => ({ success: true, value: fakeStates }),
  },
});

const getFormFields = () => {
  const switchButton = screen.getByRole('checkbox');
  const inputFirstName = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.billing_information_firstname',
  });
  const inputLastName = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.billing_information_lastname',
  });
  const inputAddress = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.billing_information_address',
  });
  const inputCity = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.billing_information_city',
  });
  const selectCountry = screen.getByRole('combobox', {
    name: '*checkoutProcessForm.billing_information_country',
  });
  const selectProvince = screen.getByRole('combobox', {
    name: '*checkoutProcessForm.billing_information_province',
  });
  const inputPhone = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.billing_information_phone',
  });

  return {
    switchButton,
    inputFirstName,
    inputLastName,
    inputAddress,
    inputCity,
    selectCountry,
    selectProvince,
    inputPhone,
  };
};

const mockedHandleSaveAndContinue = jest.fn();
const initialProps = {
  handleSaveAndContinue: mockedHandleSaveAndContinue,
  showTitle: false,
};

const BillingInformationElement = ({ withEmptyData, useContactInformationAsBilling }) => {
  const services = dependencies(withEmptyData, useContactInformationAsBilling);
  return (
    <AppServicesProvider forcedServices={services}>
      <IntlProvider>
        <BrowserRouter>
          <BillingInformation {...initialProps} />
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );
};

describe('BillingInformation component', () => {
  it('should show loading box while getting data', async () => {
    // Act
    render(<BillingInformationElement withEmptyData={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should load data from api correctly', async () => {
    // Act
    render(<BillingInformationElement withEmptyData={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const {
      switchButton,
      inputFirstName,
      inputLastName,
      inputAddress,
      inputCity,
      selectCountry,
      selectProvince,
      inputPhone,
    } = getFormFields();

    // Data should load correctly
    expect(switchButton).not.toBeChecked();
    expect(inputFirstName).toHaveValue(fakeBillingInformation.firstname);
    expect(inputLastName).toHaveValue(fakeBillingInformation.lastname);
    expect(inputAddress).toHaveValue(fakeBillingInformation.address);
    expect(inputCity).toHaveValue(fakeBillingInformation.city);
    expect(selectCountry).toHaveValue(fakeBillingInformation.country);
    expect(selectProvince).toHaveValue(fakeBillingInformation.province);
    expect(inputPhone).toHaveValue(fakeBillingInformation.phone);

    // form fields must not be disabled
    expect(inputFirstName).not.toBeDisabled();
    expect(inputLastName).not.toBeDisabled();
    expect(inputAddress).not.toBeDisabled();
    expect(inputCity).not.toBeDisabled();
    expect(selectCountry).not.toBeDisabled();
    expect(selectProvince).not.toBeDisabled();
    expect(inputPhone).not.toBeDisabled();
  });

  it('should show contact information when the billing information is empty', async () => {
    // Act
    render(<BillingInformationElement withEmptyData={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const {
      switchButton,
      inputFirstName,
      inputLastName,
      inputAddress,
      inputCity,
      selectCountry,
      selectProvince,
      inputPhone,
    } = getFormFields();

    // Data should show information from contact information
    expect(switchButton).toBeChecked();
    expect(inputFirstName).toHaveValue(fakeContactInformation.firstname);
    expect(inputLastName).toHaveValue(fakeContactInformation.lastname);
    expect(inputAddress).toHaveValue(fakeContactInformation.address);
    expect(inputCity).toHaveValue(fakeContactInformation.city);
    expect(selectCountry).toHaveValue(fakeContactInformation.country);
    expect(selectProvince).toHaveValue(fakeContactInformation.province);
    expect(inputPhone).toHaveValue(fakeContactInformation.phone);

    // form fields must be disabled
    expect(inputFirstName).toBeDisabled();
    expect(inputLastName).toBeDisabled();
    expect(inputAddress).toBeDisabled();
    expect(inputCity).toBeDisabled();
    expect(selectCountry).toBeDisabled();
    expect(selectProvince).toBeDisabled();
    expect(inputPhone).toBeDisabled();
  });

  it('should call handleSaveAndContinue function if the submit was succesfully', async () => {
    // Arrange
    const newFirstName = 'Test First Name';

    // Act
    render(<BillingInformationElement withEmptyData={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    let inputFirstName = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_firstname',
    });
    await act(() => user.clear(inputFirstName));
    await act(() => user.type(inputFirstName, newFirstName));
    inputFirstName = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_firstname',
    });
    expect(inputFirstName).toHaveValue(newFirstName);

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.save_continue',
    });
    await act(() => user.click(submitButton));

    expect(mockedHandleSaveAndContinue).toBeCalledTimes(1);
  });

  it('should show messages for empty required fields', async () => {
    // Act
    render(
      <BillingInformationElement withEmptyData={true} useContactInformationAsBilling={false} />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'checkoutProcessForm.save_continue' });
    await act(() => user.click(submitButton));

    // Validation error messages should be displayed
    const validationErrorMessages = await screen.findAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(7);
  });
});
