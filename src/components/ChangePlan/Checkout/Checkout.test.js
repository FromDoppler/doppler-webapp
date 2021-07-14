import React from 'react';
import { render, cleanup, waitFor, fireEvent, getByText } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import Checkout from './Checkout';

describe('Checkout component', () => {
  afterEach(cleanup);

  const contactInformation = {
    email: 'test@makingsense.com',
    firstname: 'Juan',
    lastname: 'Perez',
    address: 'Alem 1234',
    city: 'Tandil',
    province: 'Buenos Aires',
    countryId: 1,
    zipCode: '7000',
    phone: '+542494228090',
    company: 'Test',
    industry: 'IT',
    completed: true,
  };

  const dependencies = {
    dopplerUserApiClient: {
      getContactInformationData: async () => {
        return { success: true, value: contactInformation };
      },
      createOrUpdateContactInformation: async () => {
        return { success: true };
      },
    },
  };

  const CheckoutElement = () => (
    <AppServicesProvider forcedServices={dependencies}>
      <IntlProvider>
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
      </IntlProvider>
    </AppServicesProvider>
  );

  it('should show contact information', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container } = result;

    // Assert
    expect(container.querySelector('.contact-information')).toBeInTheDocument();
  });

  it('should show messages for empty required fields', async () => {
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getAllByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: '' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: '' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: '' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: '' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: '' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: '' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: '' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getAllByText('validation_messages.error_required_field').length).toBe(8);
  });

  it('should show error message if firstname field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: '' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: '1234' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'tandil' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'buenos aires' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message if lastname field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: '' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: '1234' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'tandil' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'buenos aires' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message if address field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'Test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: '' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'tandil' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'buenos aires' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message if city field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'Test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: 'address 1' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: '' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'buenos aires' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message if province field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'Test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: 'address 1' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'tandil' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: '' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message if country field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'Test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: 'address 1' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'tandil' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'province 1' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: '' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message if phone field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'Test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: 'address 1' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'tandil' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'province 1' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message if industry field is empty', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'Test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'Test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: 'address 1' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'tandil' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'pronvince 1' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: '' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '+54 223 655-8877' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show success message if the submit was succesfully', async () => {
    // Arrange
    let result;
    await act(async () => {
      result = render(<CheckoutElement />);
    });

    const { container, getByText } = result;

    // Act
    act(() => {
      const inputFirstname = container.querySelector('input#firstname');
      fireEvent.change(inputFirstname, { target: { value: 'test' } });

      const inputLastname = container.querySelector('input#lastname');
      fireEvent.change(inputLastname, { target: { value: 'test' } });

      const inputAddress = container.querySelector('input#address');
      fireEvent.change(inputAddress, { target: { value: 'address 1' } });

      const inputCity = container.querySelector('input#city');
      fireEvent.change(inputCity, { target: { value: 'city' } });

      const inputProvince = container.querySelector('input#province');
      fireEvent.change(inputProvince, { target: { value: 'province' } });

      const selectCountry = container.querySelector('select#country');
      fireEvent.change(selectCountry, { target: { value: 'ar' } });

      const inputIndustry = container.querySelector('input#industry');
      fireEvent.change(inputIndustry, { target: { value: 'IT' } });

      const inputPhone = container.querySelector('input#phone');
      fireEvent.change(inputPhone, { target: { value: '2494222222' } });
    });

    await act(async () => {
      const submitButton = container.querySelector('button[type="submit"]');
      fireEvent.submit(submitButton);
    });

    // Assert
    expect(getByText('checkoutProcessForm.success_msg')).toBeInTheDocument();
  });
});
