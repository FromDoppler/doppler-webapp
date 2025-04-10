import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen } from '@testing-library/react';
import { SelectedPushNotificationPlan } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import userEvent from '@testing-library/user-event';

describe('SelectedPushNotificationPlan', () => {
  it('should render SelectedPushNotificationPlan when there is not a selected plan push notification', async () => {
    // Arrange
    const seletedPlanPushNotification = { quantity: 0 };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedPushNotificationPlan
          selectedPlan={seletedPlanPushNotification}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    screen.getByText(
      'push_notification_selection.selected_push_notification_plan.no_push_notification_plan_selected_message',
    );

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(
        button,
        'push_notification_selection.selected_push_notification_plan.add_to_cart_button',
      ),
    ).toBeInTheDocument();
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(addItem).not.toBeCalled();
  });

  it('should render SelectedPushNotificationPlan when there is a selected push notification plan', async () => {
    // Arrange
    const seletedPushNotificationPlan = {
      planId: 1,
      quantity: 500,
      fee: 30,
      additional: 5,
    };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedPushNotificationPlan
          selectedPlan={seletedPushNotificationPlan}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.queryByText(
        'push_notification_selection.selected_push_notification_plan.no_push_notification_plan_selected_message',
      ),
    ).not.toBeInTheDocument();
    screen.getByRole('list');

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(
        button,
        'push_notification_selection.selected_push_notification_plan.add_to_cart_button',
      ),
    ).toBeInTheDocument(); // because there is not an added item to cart
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(addItem).toBeCalled();
  });

  it('should render SelectedPushNotificationPlan when click on add to cart button', async () => {
    // Arrange
    const seletedPushNotificationPlan = {
      planId: 1,
      quantity: 500,
      fee: 30,
      additional: 5,
    };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedPushNotificationPlan
          selectedPlan={seletedPushNotificationPlan}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(
        button,
        'push_notification_selection.selected_push_notification_plan.add_to_cart_button',
      ),
    ).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(addItem).not.toBeCalled();
    await userEvent.click(button);
    expect(addItem).toBeCalledWith(seletedPushNotificationPlan);
  });

  it('should render SelectedOnSitePlan when click on remove item button', async () => {
    // Arrange
    const seletedPushNotificationPlan = {
      planId: 1,
      quantity: 500,
      fee: 30,
      additional: 5,
    };
    const item = seletedPushNotificationPlan; // In this case, the slider value and the cart item are the same
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedPushNotificationPlan
          selectedPlan={seletedPushNotificationPlan}
          item={item}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert

    // click on button
    expect(removeItem).not.toBeCalled();
    const button = screen.getByRole('button');
    expect(
      getByText(
        button,
        'push_notification_selection.selected_push_notification_plan.remove_from_cart_button',
      ),
    ).toBeInTheDocument();
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(removeItem).toBeCalled();
  });
});
