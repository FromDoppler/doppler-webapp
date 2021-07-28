import React from 'react';
import {
  fireEvent,
  screen,
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { ContactPolicy } from './ContactPolicy';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { excludedSubscribersLists } from '../../services/doppler-contact-policy-api-client.double';

describe('ContactPolicy component', () => {
  const featuresDouble = () => ({
    contactPolicies: true,
  });
  const dopplerUserApiClientDouble = () => ({
    getFeatures: async () => ({
      success: true,
      value: featuresDouble(),
    }),
  });

  const email = 'hardcoded@email.com';
  const settingsDouble = () => ({
    accountName: email,
    active: false,
    emailsAmountByInterval: 20,
    intervalInDays: 7,
    excludedSubscribersLists,
  });

  const dopplerContactPolicyApiClientDouble = () => ({
    getAccountSettings: async () => ({
      success: true,
      value: settingsDouble(),
    }),
    updateAccountSettings: async () => ({
      success: true,
    }),
  });

  const dependencies = {
    dopplerUserApiClient: dopplerUserApiClientDouble(),
    dopplerContactPolicyApiClient: dopplerContactPolicyApiClientDouble(),
  };

  const mockedGoBack = jest.fn();
  const initialProps = {
    history: {
      goBack: mockedGoBack,
    },
  };

  const ContactPolicyComponent = ({ isEnabled = true }) => {
    const services = isEnabled ? dependencies : {};
    return (
      <AppServicesProvider forcedServices={services}>
        <BrowserRouter>
          <DopplerIntlProvider>
            <ContactPolicy {...initialProps} />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>
    );
  };

  it('should show loading box while getting data', () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    expect(loadingBox).toBeInTheDocument();
    waitFor(() => {
      expect(loadingBox).not.toBeInTheDocument();
    });
  });

  it('should load data from api correctly', async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    // Assert
    await waitFor(() => {
      const cloudTags = container.querySelector('.dp-cloud-tags.dp-overlay');
      expect(container.querySelector('input#contact-policy-switch')).not.toBeChecked();
      expect(container.querySelector('input#contact-policy-input-amount').value).toEqual(
        `${settingsDouble().emailsAmountByInterval}`,
      );
      expect(container.querySelector('input#contact-policy-input-interval').value).toEqual(
        `${settingsDouble().intervalInDays}`,
      );
      expect(cloudTags).toBeInTheDocument();
    });
  });

  it('should show success message when updating data correctly', async () => {
    // Act
    const { container, findByText, getByText } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);

    const switchButton = container.querySelector('input#contact-policy-switch');
    fireEvent.click(switchButton);
    expect(switchButton).toBeChecked();

    fireEvent.click(getByText('common.save'));
    expect(await findByText('contact_policy.success_msg'));
  });

  it('should disable the inputs if the switch is not active', async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    // Assert
    await waitFor(() => {
      const addButton = screen.getByRole('button', { name: 'add tag' });
      const cloudTags = screen.getByRole('list', { name: 'cloud tags' });
      expect(container.querySelector('input#contact-policy-switch')).not.toBeChecked();
      expect(container.querySelector('input#contact-policy-input-amount')).toBeDisabled();
      expect(container.querySelector('input#contact-policy-input-interval')).toBeDisabled();
      expect(cloudTags).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveAttribute('disabled');
      expect(cloudTags).toHaveClass('dp-overlay');
    });
  });

  it("shouldn't disable the inputs if the switch is active", async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);

    const addButton = screen.getByRole('button', { name: 'add tag' });
    const cloudTags = screen.getByRole('list', { name: 'cloud tags' });
    const switchButton = container.querySelector('input#contact-policy-switch');
    const inputAmount = container.querySelector('input#contact-policy-input-amount');
    const inputInterval = container.querySelector('input#contact-policy-input-interval');

    expect(switchButton).not.toBeChecked();
    expect(inputAmount).toBeDisabled();
    expect(inputInterval).toBeDisabled();

    fireEvent.click(switchButton);

    expect(switchButton).toBeChecked();
    expect(inputAmount).not.toBeDisabled();
    expect(inputInterval).not.toBeDisabled();
    expect(addButton).not.toHaveAttribute('disabled');
    expect(cloudTags).not.toHaveClass('dp-overlay');
  });

  it('should show the contact policy configuration if the feature is enabled', async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    //Assert
    await waitFor(() => {
      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  it("shouldn't show the contact policy configuration if the feature is disabled", async () => {
    //Act
    const { container, getByText } = render(<ContactPolicyComponent isEnabled={false} />);

    //Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);
    expect(getByText('common.feature_no_available'));
  });

  it('should show error message and highlight the field if the emails amount is empty', async () => {
    // Act
    const { container, getByRole, findByRole, getByText } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);
    const submitButton = getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    expect(getByRole('checkbox')).not.toBeChecked();
    fireEvent.click(getByRole('checkbox'));
    expect(await findByRole('checkbox')).toBeChecked();
    expect(submitButton).not.toBeDisabled();

    const inputAmount = container.querySelector('input#contact-policy-input-amount');
    fireEvent.change(inputAmount, { target: { value: '' } });
    expect(inputAmount).toHaveValue(null);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    expect(inputAmount).toHaveClass('dp-error-input');
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the interval in days is empty', async () => {
    // Act
    const { container, getByRole, findByRole, getByText } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);
    const submitButton = getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    expect(getByRole('checkbox')).not.toBeChecked();
    fireEvent.click(getByRole('checkbox'));
    expect(await findByRole('checkbox')).toBeChecked();
    expect(submitButton).not.toBeDisabled();

    const inputInterval = container.querySelector('input#contact-policy-input-interval');
    fireEvent.change(inputInterval, { target: { value: '' } });
    expect(inputInterval).toHaveValue(null);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    expect(inputInterval).toHaveClass('dp-error-input');
    expect(getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the emails amount is out of range', async () => {
    // Act
    const { container, getByRole, findByRole, getByText } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);
    const submitButton = getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    expect(getByRole('checkbox')).not.toBeChecked();
    fireEvent.click(getByRole('checkbox'));
    expect(await findByRole('checkbox')).toBeChecked();
    expect(submitButton).not.toBeDisabled();

    const inputAmount = container.querySelector('input#contact-policy-input-amount');
    fireEvent.change(inputAmount, { target: { value: '1000' } });
    expect(inputAmount).toHaveValue(1000);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    expect(inputAmount).toHaveClass('dp-error-input');
    expect(getByText('contact_policy.error_invalid_range_msg')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the interval in days is out of range', async () => {
    // Act
    const { container, getByRole, findByRole, getByText } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);
    const submitButton = getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    expect(getByRole('checkbox')).not.toBeChecked();
    fireEvent.click(getByRole('checkbox'));
    expect(await findByRole('checkbox')).toBeChecked();
    expect(submitButton).not.toBeDisabled();

    const inputInterval = container.querySelector('input#contact-policy-input-interval');
    fireEvent.change(inputInterval, { target: { value: '31' } });
    expect(inputInterval).toHaveValue(31);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
    expect(inputInterval).toHaveClass('dp-error-input');
    expect(getByText('contact_policy.error_invalid_range_msg')).toBeInTheDocument();
  });

  it('should call go back function if back button is pressed', async () => {
    // Act
    const { container, getByRole } = render(<ContactPolicyComponent />);

    // Assert
    const loadingBox = container.querySelector('.wrapper-loading');
    await waitForElementToBeRemoved(loadingBox);

    const switchButton = container.querySelector('input#contact-policy-switch');
    fireEvent.click(switchButton);
    expect(switchButton).toBeChecked();

    const backButton = getByRole('button', { name: 'common.back' });
    fireEvent.click(backButton);
    expect(mockedGoBack).toBeCalledTimes(1);
  });
});
