import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
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

describe('BillingInformation component', () => {
  const dependencies = (withEmptyData) => ({
    dopplerUserApiClient: {
      getContactInformationData: async () => {
        return { success: true, value: fakeContactInformation };
      },
    },
    dopplerBillingUserApiClient: {
      getBillingInformationData: async () => {
        return {
          success: true,
          value: !withEmptyData ? fakeBillingInformation : fakeBillingInformationWithEmptyData,
        };
      },
      updateBillingInformation: async () => {
        return { success: true };
      },
    },
    staticDataClient: {
      getStatesData: async (country, language) => ({ success: true, value: fakeStates }),
    },
  });

  const mockedHandleSaveAndContinue = jest.fn();
  const initialProps = {
    handleSaveAndContinue: mockedHandleSaveAndContinue,
    showTitle: false,
  };

  const BillingInformationElement = ({ withEmptyData }) => {
    const services = dependencies(withEmptyData);
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

  jest.setTimeout(10000);

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

    // Data should load correctly
    expect(switchButton).not.toBeChecked();
    expect(inputFirstName).toHaveValue(fakeBillingInformation.firstname);
    expect(inputLastName).toHaveValue(fakeBillingInformation.lastname);
    expect(inputAddress).toHaveValue(fakeBillingInformation.address);
    expect(inputCity).toHaveValue(fakeBillingInformation.city);
    expect(selectCountry).toHaveValue(fakeBillingInformation.country);
    expect(selectProvince).toHaveValue(fakeBillingInformation.province);
    expect(inputPhone).toHaveValue(fakeBillingInformation.phone);
  });

  it('should show contact information when the billing information is empty', async () => {
    // Act
    render(<BillingInformationElement withEmptyData={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

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

    // Data should show information from contact information
    expect(switchButton).toBeChecked();
    expect(inputFirstName).toHaveValue(fakeContactInformation.firstname);
    expect(inputLastName).toHaveValue(fakeContactInformation.lastname);
    expect(inputAddress).toHaveValue(fakeContactInformation.address);
    expect(inputCity).toHaveValue(fakeContactInformation.city);
    expect(selectCountry).toHaveValue(fakeContactInformation.country);
    expect(selectProvince).toHaveValue(fakeContactInformation.province);
    expect(inputPhone).toHaveValue(fakeContactInformation.phone);
  });

  it('should disable the form fields if the switch is active', async () => {
    // Act
    render(<BillingInformationElement withEmptyData={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

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

    expect(switchButton).toBeChecked();
    expect(inputFirstName).toBeDisabled();
    expect(inputLastName).toBeDisabled();
    expect(inputAddress).toBeDisabled();
    expect(inputCity).toBeDisabled();
    expect(selectCountry).toBeDisabled();
    expect(selectProvince).toBeDisabled();
    expect(inputPhone).toBeDisabled();
  });

  it("shouldn't disable the inputs if the switch is not active", async () => {
    // Act
    render(<BillingInformationElement withEmptyData={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

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

    expect(switchButton).not.toBeChecked();
    expect(inputFirstName).not.toBeDisabled();
    expect(inputLastName).not.toBeDisabled();
    expect(inputAddress).not.toBeDisabled();
    expect(inputCity).not.toBeDisabled();
    expect(selectCountry).not.toBeDisabled();
    expect(selectProvince).not.toBeDisabled();
    expect(inputPhone).not.toBeDisabled();
  });

  it('should call handleSaveAndContinue function if the submit was succesfully', async () => {
    // Arrange
    render(<BillingInformationElement withEmptyData={false} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    let inputFirstName = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_firstname',
    });
    user.clear(inputFirstName);
    user.type(inputFirstName, 'Test First Name');
    inputFirstName = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_firstname',
    });
    expect(inputFirstName).toHaveValue('Test First Name');

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.save_continue',
    });
    user.click(submitButton);

    // handleSaveAndContinue function should be called
    await waitFor(() => expect(mockedHandleSaveAndContinue).toBeCalledTimes(1));
  });

  it('should show messages for empty required fields', async () => {
    // Act
    render(<BillingInformationElement withEmptyData={false} />);

    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Set first name empty
    let inputFirstName = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_firstname',
    });
    user.clear(inputFirstName);

    // Set last name empty
    let inputLastName = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_lastname',
    });
    user.clear(inputLastName);

    // Set address empty
    let inputAddress = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_address',
    });
    user.clear(inputAddress);

    // Set city empty
    let inputCity = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_city',
    });
    user.clear(inputCity);

    // Set country empty
    let selectCountry = screen.getByRole('combobox', {
      name: '*checkoutProcessForm.billing_information_country',
    });
    user.selectOptions(selectCountry, '');

    // Set province empty
    let selectProvince = screen.getByRole('combobox', {
      name: '*checkoutProcessForm.billing_information_province',
    });
    user.selectOptions(selectProvince, '');

    // Set phone empty
    let inputPhone = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.billing_information_phone',
    });
    user.clear(inputPhone);

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'checkoutProcessForm.save_continue' });
    user.click(submitButton);

    // Validation error messages should be displayed
    const validationErrorMessages = await screen.findAllByText(
      'validation_messages.error_required_field',
    );
    expect(validationErrorMessages).toHaveLength(7);
  }, 15000);
});
