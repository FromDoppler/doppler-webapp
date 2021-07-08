import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { ContactPolicy } from './ContactPolicy';
import { AppServicesProvider } from '../../services/pure-di';

describe('ContactPolicy component', () => {
  afterEach(cleanup);

  const email = 'hardcoded@email.com';
  const settingsDouble = () => ({
    accountName: email,
    active: false,
    emailsAmountByInterval: 20,
    intervalInDays: 7,
    excludedSubscribersLists: [],
  });

  const dopplerContactPolicyApiClientDouble = () => ({
    getAccountSettings: async () => ({
      success: true,
      value: settingsDouble,
    }),
    updateAccountSettings: async () => ({
      success: true,
    }),
  });

  const experimentalFeatureDouble = () => ({
    getFeature: (feature) => feature === 'ContactPolicy',
  });

  const dependencies = {
    dopplerContactPolicyApiClient: dopplerContactPolicyApiClientDouble(),
    experimentalFeatures: experimentalFeatureDouble(),
  };

  const ContactPolicyComponent = ({ isEnabled = true }) => {
    const services = isEnabled ? dependencies : {};
    return (
      <AppServicesProvider forcedServices={services}>
        <DopplerIntlProvider>
          <ContactPolicy />
        </DopplerIntlProvider>
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
      expect(container.querySelector('input#contact-policy-switch')).not.toBeChecked();
      expect(container.querySelector('input#contact-policy-input-amount').value).toEqual(
        `${settingsDouble().emailsAmountByInterval}`,
      );
      expect(container.querySelector('input#contact-policy-input-interval').value).toEqual(
        `${settingsDouble().intervalInDays}`,
      );
    });
  });

  it('should show success message when updating data correctly', async () => {
    // // Act
    const { getByText } = render(<ContactPolicyComponent />);

    //TODO: Improve this code
    await waitFor(async () => {
      fireEvent.click(getByText('common.save'));

      // Assert
      expect(getByText('contact_policy.success_msg'));
    });
  });

  it('should disable the inputs if the switch is not active', async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('input#contact-policy-switch')).not.toBeChecked();
      expect(container.querySelector('input#contact-policy-input-amount')).toBeDisabled();
      expect(container.querySelector('input#contact-policy-input-interval')).toBeDisabled();
    });
  });

  it("shouldn't disable the inputs if the switch is active", async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    //TODO: Improve this code
    await waitFor(() => {
      const switchButton = container.querySelector('input#contact-policy-switch');
      fireEvent.click(switchButton);

      // Assert
      expect(switchButton).toBeChecked();
      expect(container.querySelector('input#contact-policy-input-amount')).not.toBeDisabled();
      expect(container.querySelector('input#contact-policy-input-interval')).not.toBeDisabled();
    });
  });

  it('should show the contact policy configuration if the feature is enabled', async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    //Assert
    await waitFor(() => {
      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  it("shouldn't show the contact policy configuration if the feature is disabled", () => {
    //Act
    const { getByText } = render(<ContactPolicyComponent isEnabled={false} />);

    //Assert
    expect(getByText('common.feature_no_available'));
  });
});
