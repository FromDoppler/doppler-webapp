import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import {
  fakeIndustries,
  fakeQuestions,
  fakeStates,
} from '../../../../services/static-data-client.double';
import { ContactInformation } from './ContactInformation';

const contactInformation = {
  email: 'test@makingsense.com',
  firstname: 'Juan',
  lastname: 'Perez',
  address: 'Alem 1234',
  city: 'Tandil',
  province: 'AR-B',
  country: 'ar',
  zipCode: '7000',
  phone: '+54 249 422-2222',
  company: 'Test',
  industry: 'dplr1',
  idSecurityQuestion: '1',
  answerSecurityQuestion: 'answer',
  completed: true,
};

const emptyContactInformation = {
  email: '',
  firstname: '',
  lastname: '',
  address: '',
  city: '',
  province: '',
  country: '',
  zipCode: '',
  phone: '',
  company: '',
  industry: '',
  idSecurityQuestion: '',
  answerSecurityQuestion: '',
  completed: false,
};

const dependencies = (withEmptyData = false) => ({
  dopplerUserApiClient: {
    getContactInformationData: async () => {
      return { success: true, value: withEmptyData ? emptyContactInformation : contactInformation };
    },
    updateContactInformation: async () => {
      return { success: true };
    },
  },
  staticDataClient: {
    getIndustriesData: async (language) => ({ success: true, value: fakeIndustries }),
    getStatesData: async (country, language) => ({ success: true, value: fakeStates }),
    getSecurityQuestionsData: async (language) => ({ success: true, value: fakeQuestions }),
  },
});

const getFormFields = () => {
  const inputFirstName = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.contact_information_firstname',
  });
  const inputLastName = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.contact_information_lastname',
  });
  const inputAddress = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.contact_information_address',
  });
  const inputCity = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.contact_information_city',
  });
  const selectCountry = screen.getByRole('combobox', {
    name: '*checkoutProcessForm.contact_information_country',
  });
  const selectProvince = screen.getByRole('combobox', {
    name: '*checkoutProcessForm.contact_information_province',
  });
  const inputZipCode = screen.getByRole('textbox', {
    name: 'checkoutProcessForm.contact_information_zip_code',
  });
  const inputPhone = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.contact_information_phone',
  });
  const inputCompany = screen.getByRole('textbox', {
    name: 'checkoutProcessForm.contact_information_company',
  });
  const inputAnswer = screen.getByRole('textbox', {
    name: '*checkoutProcessForm.contact_information_security_response',
  });
  const selectQuestion = screen.getByRole('combobox', {
    name: 'secutiry-question',
  });
  const selectIndustry = screen.getByRole('combobox', {
    name: '*checkoutProcessForm.contact_information_industry',
  });

  return {
    inputFirstName,
    inputLastName,
    inputAddress,
    inputCity,
    selectCountry,
    selectProvince,
    inputPhone,
    inputZipCode,
    inputCompany,
    selectIndustry,
    selectQuestion,
    inputAnswer,
  };
};

const mockedHandleSaveAndContinue = jest.fn();
const initialProps = {
  handleSaveAndContinue: mockedHandleSaveAndContinue,
  showTitle: false,
};

const ContactInformationElement = ({ withEmptyData }) => (
  <AppServicesProvider forcedServices={dependencies(withEmptyData)}>
    <IntlProvider>
      <BrowserRouter>
        <ContactInformation {...initialProps} />
      </BrowserRouter>
    </IntlProvider>
  </AppServicesProvider>
);

describe('Checkout component', () => {
  it('should show loading box while getting data', async () => {
    // Act
    render(<ContactInformationElement />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should load data from api correctly', async () => {
    // Act
    render(<ContactInformationElement />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const {
      inputFirstName,
      inputLastName,
      inputAddress,
      inputCity,
      selectCountry,
      selectProvince,
      inputPhone,
      inputZipCode,
      inputCompany,
      selectIndustry,
      selectQuestion,
      inputAnswer,
    } = getFormFields();

    // Data should load correctly
    expect(inputFirstName).toHaveValue(contactInformation.firstname);
    expect(inputLastName).toHaveValue(contactInformation.lastname);
    expect(inputAddress).toHaveValue(contactInformation.address);
    expect(inputCity).toHaveValue(contactInformation.city);
    expect(selectProvince).toHaveValue(contactInformation.province);
    expect(selectCountry).toHaveValue(contactInformation.country);
    expect(inputZipCode).toHaveValue(contactInformation.zipCode);
    expect(inputPhone).toHaveValue(contactInformation.phone);
    expect(inputCompany).toHaveValue(contactInformation.company);
    expect(selectIndustry).toHaveValue(contactInformation.industry);
    expect(selectQuestion).toHaveValue(contactInformation.idSecurityQuestion);
    expect(inputAnswer).toHaveValue(contactInformation.answerSecurityQuestion);
  });

  it('should show messages for empty required fields', async () => {
    // Act
    render(<ContactInformationElement withEmptyData={true} />);

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
    expect(validationErrorMessages).toHaveLength(10);
  });

  it('should call handleSaveAndContinue function if the submit was succesfully', async () => {
    // Arrange
    const newFirstName = 'Test First Name';

    // Act
    render(<ContactInformationElement />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    let inputFirstName = screen.getByRole('textbox', {
      name: '*checkoutProcessForm.contact_information_firstname',
    });
    await act(() => user.clear(inputFirstName));
    await act(() => user.type(inputFirstName, newFirstName));
    inputFirstName = await screen.findByRole('textbox', {
      name: '*checkoutProcessForm.contact_information_firstname',
    });
    expect(inputFirstName).toHaveValue(newFirstName);

    // Click save button
    const submitButton = screen.getByRole('button', {
      name: 'checkoutProcessForm.save_continue',
    });
    await act(() => user.click(submitButton));

    expect(mockedHandleSaveAndContinue).toBeCalledTimes(1);
  });
});
