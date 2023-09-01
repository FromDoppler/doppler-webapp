import { render, screen, waitForElementToBeRemoved, act } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { ContactPolicy } from './ContactPolicy';
import { AppServicesProvider } from '../../services/pure-di';
import { BrowserRouter } from 'react-router-dom';
import { subscriberListCollection } from '../../services/doppler-api-client.double';

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
  const settingsDouble = (isActive, excludedSubscribersLists, isTimeSlotEnabled) => ({
    accountName: email,
    active: isActive,
    emailsAmountByInterval: 20,
    intervalInDays: 7,
    timeRestriction: {
      timeSlotEnabled: isTimeSlotEnabled,
      hourFrom: 1,
      hourTo: 2,
      weekdaysEnabled: false,
    },
    excludedSubscribersLists,
  });

  const dopplerContactPolicyApiClientDouble = (
    isActive,
    hasErrorOnUpdate,
    excludedSubscribersLists,
    isTimeSlotEnabled,
  ) => ({
    getAccountSettings: async () => ({
      success: true,
      value: settingsDouble(isActive, excludedSubscribersLists, isTimeSlotEnabled),
    }),
    updateAccountSettings: async () => ({
      success: !hasErrorOnUpdate,
    }),
  });

  // TODO: remove once the whole "time restriction" feature is implemented
  const experimentalFeaturesDouble = () => ({
    getFeature: (featureName) => {
      return featureName === 'timeRestrictionEnabled';
    },
  });

  const dependencies = (
    isActive,
    hasErrorOnUpdate,
    excludedSubscribersLists,
    isTimeSlotEnabled,
  ) => ({
    dopplerUserApiClient: dopplerUserApiClientDouble(),
    dopplerContactPolicyApiClient: dopplerContactPolicyApiClientDouble(
      isActive,
      hasErrorOnUpdate,
      excludedSubscribersLists,
      isTimeSlotEnabled,
    ),
    experimentalFeatures: experimentalFeaturesDouble(),
  });

  const ContactPolicyComponent = ({
    isEnabled = true,
    isActive = false,
    hasErrorOnUpdate = false,
    customExcludedSubscribersLists = subscriberListCollection(5),
    isTimeSlotEnabled = false,
  }) => {
    const services = isEnabled
      ? dependencies(isActive, hasErrorOnUpdate, customExcludedSubscribersLists, isTimeSlotEnabled)
      : {};
    return (
      <AppServicesProvider forcedServices={services}>
        <BrowserRouter>
          <DopplerIntlProvider>
            <ContactPolicy />
          </DopplerIntlProvider>
        </BrowserRouter>
      </AppServicesProvider>
    );
  };

  it('should show loading box while getting data', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);
  });

  it('should load data from api correctly', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    const inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    const inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    const cloudTags = screen.getByRole('list', { name: 'cloud tags' });

    // Time Restriction section
    const switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    const inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    const inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    const switchButtonWeekdays = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });

    // Data should load correctly
    expect(switchButton).not.toBeChecked();
    expect(inputAmount).toHaveValue(settingsDouble().emailsAmountByInterval);
    expect(inputInterval).toHaveValue(settingsDouble().intervalInDays);
    expect(cloudTags).toBeInTheDocument();
    expect(switchButtonTimeSlot).not.toBeChecked();
    expect(inputHourFrom).toHaveValue(settingsDouble().timeRestriction.hourFrom);
    expect(inputHourTo).toHaveValue(settingsDouble().timeRestriction.hourTo);
    expect(switchButtonWeekdays).not.toBeChecked();
  });

  it('should show success message when updating data correctly', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).not.toBeChecked();
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Set 10 emails
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    await act(() => user.type(inputAmount, '10'));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(10);

    // Set 14 days
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    await act(() => user.type(inputInterval, '14'));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(14);

    // Enable "Time Slot" switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).not.toBeChecked();
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Set "Hour From" = 10
    let inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    await act(() => user.clear(inputHourFrom));
    await act(() => user.type(inputHourFrom, '10'));
    inputHourFrom = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    expect(inputHourFrom).toHaveValue(10);

    // Set "Hour To" = 20
    let inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    await act(() => user.clear(inputHourTo));
    await act(() => user.type(inputHourTo, '20'));
    inputHourTo = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    expect(inputHourTo).toHaveValue(20);

    // Enable "Weekdays" switch button
    let switchButtonWeekdays = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    expect(switchButtonWeekdays).not.toBeChecked();
    await act(() => user.click(switchButtonWeekdays));
    switchButtonWeekdays = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    expect(switchButtonWeekdays).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    const successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();
  });

  it('should disable the "shipments quantity" fields if the related switch is not active', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    const inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    const inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    const addButton = screen.getByRole('button', { name: 'add tag' });
    const cloudTags = screen.getByRole('list', { name: 'cloud tags' });

    // Form fields should be disabled
    expect(switchButton).not.toBeChecked();
    expect(inputAmount).toBeDisabled();
    expect(inputInterval).toBeDisabled();
    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
    expect(cloudTags).toBeInTheDocument();
    expect(cloudTags).toHaveClass('dp-overlay');
  });

  it('should disable the "time slot" fields if the related switch is not active', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    const switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    const inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    const inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });

    // Assert
    expect(switchButtonTimeSlot).not.toBeChecked();
    expect(inputHourFrom).toBeDisabled();
    expect(inputHourTo).toBeDisabled();
  });

  it('shouldn\'t disable the "shipments quantity" inputs if the related switch is active', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    const inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    const inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    const addButton = screen.getByRole('button', { name: 'add tag' });
    const cloudTags = screen.getByRole('list', { name: 'cloud tags' });

    // Switch shouldn't be checked and inputs fields disabled
    expect(switchButton).not.toBeChecked();
    expect(inputAmount).toBeDisabled();
    expect(inputInterval).toBeDisabled();

    // Enable switch button
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });

    // Switch should be checked and inputs fields enabled
    expect(switchButton).toBeChecked();
    expect(inputAmount).not.toBeDisabled();
    expect(inputInterval).not.toBeDisabled();
    expect(addButton).not.toHaveAttribute('disabled');
    expect(cloudTags).not.toHaveClass('dp-overlay');
  });

  it('shouldn\'t disable the "time slot" inputs if the related switch is active', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    const inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    const inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });

    // Switch shouldn't be checked and inputs fields disabled
    expect(switchButtonTimeSlot).not.toBeChecked();
    expect(inputHourFrom).toBeDisabled();
    expect(inputHourTo).toBeDisabled();

    // Enable switch button
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });

    // Switch should be checked and inputs fields enabled
    expect(switchButtonTimeSlot).toBeChecked();
    expect(inputHourFrom).not.toBeDisabled();
    expect(inputHourTo).not.toBeDisabled();
  });

  it('should show the contact policy configuration if the feature is enabled', async () => {
    // Act
    render(<ContactPolicyComponent />);
    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Form should be displayed
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it("shouldn't show the contact policy configuration if the feature is disabled", async () => {
    // Act
    render(<ContactPolicyComponent isEnabled={false} />);
    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Form shouldn't be displayed
    const form = screen.queryByRole('form');
    expect(form).not.toBeInTheDocument();
  });

  it('should hide success message when hit save and then toggle the "shipments quantity" switch', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    let successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();

    // Disable switch button
    switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).not.toBeChecked();

    // Success message should be hidden
    successMessage = screen.queryByText('contact_policy.success_msg');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('should hide success message when hit save and then toggle the "time slot" switch', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    let successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();

    // Disable switch button
    switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).not.toBeChecked();

    // Success message should be hidden
    successMessage = screen.queryByText('contact_policy.success_msg');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('should hide success message when hit save and then toggle the "weekdays" switch', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButtonWeekdays = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    await act(() => user.click(switchButtonWeekdays));
    switchButtonWeekdays = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    expect(switchButtonWeekdays).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    let successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();

    // Disable switch button
    switchButtonWeekdays = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    await act(() => user.click(switchButtonWeekdays));
    switchButtonWeekdays = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    expect(switchButtonWeekdays).not.toBeChecked();

    // Success message should be hidden
    successMessage = screen.queryByText('contact_policy.success_msg');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('should hide success message when change the emails amount', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    let successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();

    // Change emails amount
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    await act(() => user.type(inputAmount, '10'));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(10);

    // Success message should be hidden
    successMessage = screen.queryByText('contact_policy.success_msg');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('should hide success message when change the interval in days', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    // Loader should disappear once request resolves
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    let successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();

    // Change interval
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    await act(() => user.type(inputInterval, '10'));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(10);

    // Success message should be hidden
    successMessage = screen.queryByText('contact_policy.success_msg');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('should hide success message when change the hour from', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    // Loader should disappear once request resolves
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    let successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();

    // Change hour from
    let inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    await act(() => user.clear(inputHourFrom));
    await act(() => user.type(inputHourFrom, '10'));
    inputHourFrom = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    expect(inputHourFrom).toHaveValue(10);

    // Success message should be hidden
    successMessage = screen.queryByText('contact_policy.success_msg');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('should hide success message when change the hour to', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    const loader = screen.getByTestId('wrapper-loading');
    // Loader should disappear once request resolves
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Click save button
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    await act(() => user.click(submitButton));

    // Success message should be displayed
    let successMessage = await screen.findByText('contact_policy.success_msg');
    expect(successMessage).toBeInTheDocument();

    // Change interval
    let inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    await act(() => user.clear(inputHourTo));
    await act(() => user.type(inputHourTo, '10'));
    inputHourTo = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    expect(inputHourTo).toHaveValue(10);

    // Success message should be hidden
    successMessage = screen.queryByText('contact_policy.success_msg');
    expect(successMessage).not.toBeInTheDocument();
  });

  it('should disable the save button by default', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();
  });

  it('should disable the save button by default then enable it when toggle the "shipments quantity" switch', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button by default then enable it when toggle the "time slot" switch', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button by default then enable it when toggle the "weekdays" switch', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonWeekdays = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    await act(() => user.click(switchButtonWeekdays));
    switchButtonWeekdays = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    expect(switchButtonWeekdays).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button by default then enable it when change the emails amount', async () => {
    // Act
    render(<ContactPolicyComponent isActive={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Change emails amount
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    await act(() => user.type(inputAmount, '10'));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(10);

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button by default then enable it when change the interval in days', async () => {
    // Act
    render(<ContactPolicyComponent isActive={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Change interval
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    await act(() => user.type(inputInterval, '14'));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(14);

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button by default then enable it when change the hour from', async () => {
    // Act
    render(<ContactPolicyComponent isTimeSlotEnabled={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Change hour from
    let inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    await act(() => user.clear(inputHourFrom));
    await act(() => user.type(inputHourFrom, '10'));
    inputHourFrom = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    expect(inputHourFrom).toHaveValue(10);

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button by default then enable it when change the hour to', async () => {
    // Act
    render(<ContactPolicyComponent isTimeSlotEnabled={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Change hour from
    let inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    await act(() => user.clear(inputHourTo));
    await act(() => user.type(inputHourTo, '10'));
    inputHourTo = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    expect(inputHourTo).toHaveValue(10);

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button when changes are saved successfully', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    let submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Change emails amount
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    await act(() => user.type(inputAmount, '10'));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(10);

    // Change interval
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    await act(() => user.type(inputInterval, '14'));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(14);

    // Enable "Time Slot" switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).not.toBeChecked();
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Change "Hour From"
    let inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    await act(() => user.clear(inputHourFrom));
    await act(() => user.type(inputHourFrom, '10'));
    inputHourFrom = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    expect(inputHourFrom).toHaveValue(10);

    // Change "Hour To"
    let inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    await act(() => user.clear(inputHourTo));
    await act(() => user.type(inputHourTo, '20'));
    inputHourTo = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    expect(inputHourTo).toHaveValue(20);

    // Enable "Weekdays" switch button
    let switchButtonWeekdays = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    expect(switchButtonWeekdays).not.toBeChecked();
    await act(() => user.click(switchButtonWeekdays));
    switchButtonWeekdays = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.weekdays_toggle_text',
    });
    expect(switchButtonWeekdays).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Click save button
    await act(() => user.click(submitButton));

    // Save button should be disabled
    submitButton = await screen.findByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();
  });

  it('should enable the save button when an error occurs while saving changes', async () => {
    // Act
    render(<ContactPolicyComponent hasErrorOnUpdate={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    let submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Change emails amount
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    await act(() => user.type(inputAmount, '10'));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(10);

    // Change interval
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    await act(() => user.type(inputInterval, '14'));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(14);

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Click save button
    await act(() => user.click(submitButton));

    // Save button should be enabled
    submitButton = await screen.findByRole('button', { name: 'common.save' });
    expect(submitButton).not.toBeDisabled();
  });

  it('should disable the save button if the emails amount is empty', async () => {
    // Act
    render(<ContactPolicyComponent hasErrorOnUpdate={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear emails amount
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('should disable the save button if the interval in days is empty', async () => {
    // Act
    render(<ContactPolicyComponent hasErrorOnUpdate={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear interval
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('should disable the save button if the hour from is empty', async () => {
    // Act
    render(<ContactPolicyComponent hasErrorOnUpdate={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear hour from
    let inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    await act(() => user.clear(inputHourFrom));
    inputHourFrom = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    expect(inputHourFrom).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('should disable the save button if the hour to is empty', async () => {
    // Act
    render(<ContactPolicyComponent hasErrorOnUpdate={true} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear interval
    let inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    await act(() => user.clear(inputHourTo));
    inputHourTo = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    expect(inputHourTo).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('should show error message and highlight the field if the emails amount is empty', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear emails amount
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Emails amount field should be highlighted and error message should be displayed
    expect(inputAmount).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the interval in days is empty', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear interval
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Interval field should be highlighted and error message should be displayed
    expect(inputInterval).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the hour from is empty', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear hour from
    let inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    await act(() => user.clear(inputHourFrom));
    inputHourFrom = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    expect(inputHourFrom).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Interval field should be highlighted and error message should be displayed
    expect(inputHourFrom).toHaveClass('dp-error-input');
    expect(screen.getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the hour to is empty', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear hour to
    let inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    await act(() => user.clear(inputHourTo));
    inputHourTo = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    expect(inputHourTo).toHaveValue(null);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Interval field should be highlighted and error message should be displayed
    expect(inputHourTo).toHaveClass('dp-error-input');
    expect(screen.getByText('validation_messages.error_required_field')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the emails amount is out of range', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear emails amount
    let inputAmount = screen.getByRole('spinbutton', { name: 'common.emails' });
    await act(() => user.clear(inputAmount));
    await act(() => user.type(inputAmount, '1000'));
    inputAmount = await screen.findByRole('spinbutton', { name: 'common.emails' });
    expect(inputAmount).toHaveValue(1000);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Emails amount field should be highlighted and error message should be displayed
    expect(inputAmount).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('contact_policy.error_invalid_range_msg_MD')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the interval in days is out of range', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Clear interval
    let inputInterval = screen.getByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    await act(() => user.clear(inputInterval));
    await act(() => user.type(inputInterval, '31'));
    inputInterval = await screen.findByRole('spinbutton', { name: 'contact_policy.interval_unit' });
    expect(inputInterval).toHaveValue(31);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Interval field should be highlighted and error message should be displayed
    expect(inputInterval).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('contact_policy.error_invalid_range_msg_MD')).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the hour from is out of range', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Set "hour from" out of range
    let inputHourFrom = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    await act(() => user.clear(inputHourFrom));
    await act(() => user.type(inputHourFrom, '30'));
    inputHourFrom = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_from_aria_label',
    });
    expect(inputHourFrom).toHaveValue(30);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Interval field should be highlighted and error message should be displayed
    expect(inputHourFrom).toHaveClass('dp-error-input');
    expect(
      screen.getByText('contact_policy.time_restriction.error_invalid_range_of_hours_msg'),
    ).toBeInTheDocument();
  });

  it('should show error message and highlight the field if the hour to is out of range', async () => {
    // Act
    render(<ContactPolicyComponent />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Save button should be disabled
    const submitButton = screen.getByRole('button', { name: 'common.save' });
    expect(submitButton).toBeDisabled();

    // Enable switch button
    let switchButtonTimeSlot = screen.getByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    await act(() => user.click(switchButtonTimeSlot));
    switchButtonTimeSlot = await screen.findByRole('checkbox', {
      name: 'contact_policy.time_restriction.time_slot_toggle_text',
    });
    expect(switchButtonTimeSlot).toBeChecked();

    // Save button should be enabled
    expect(submitButton).not.toBeDisabled();

    // Set "hour to" out of range
    let inputHourTo = screen.getByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    await act(() => user.clear(inputHourTo));
    await act(() => user.type(inputHourTo, '30'));
    inputHourTo = await screen.findByRole('spinbutton', {
      name: 'contact_policy.time_restriction.hour_to_aria_label',
    });
    expect(inputHourTo).toHaveValue(30);

    // Save button should be disabled
    expect(submitButton).toBeDisabled();

    // Interval field should be highlighted and error message should be displayed
    expect(inputHourTo).toHaveClass('dp-error-input');
    expect(
      screen.getByText('contact_policy.time_restriction.error_invalid_range_of_hours_msg'),
    ).toBeInTheDocument();
  });

  it('should disable add list button if the maximum number of lists has been added', async () => {
    // Act
    render(
      <ContactPolicyComponent customExcludedSubscribersLists={subscriberListCollection(10)} />,
    );

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Add list button should be disabled
    const addButton = screen.getByRole('button', { name: 'add tag' });
    expect(addButton).toBeDisabled();
  });

  it('should show modal if select list button is pressed ', async () => {
    // Act
    render(<ContactPolicyComponent customExcludedSubscribersLists={subscriberListCollection(5)} />);

    // Assert
    // Loader should disappear once request resolves
    const loader = screen.getByTestId('wrapper-loading');
    await waitForElementToBeRemoved(loader);

    // Enable switch button
    let switchButton = screen.getByRole('checkbox', { name: 'contact_policy.toggle_text' });
    await act(() => user.click(switchButton));
    switchButton = await screen.findByRole('checkbox', { name: 'contact_policy.toggle_text' });
    expect(switchButton).toBeChecked();

    // Add list button should be disabled
    const addButton = screen.getByRole('button', { name: 'add tag' });
    await act(() => user.click(addButton));

    // Modal should be displayed
    const modal = await screen.findByTestId('modal');
    expect(modal).toBeInTheDocument();
  });
});
