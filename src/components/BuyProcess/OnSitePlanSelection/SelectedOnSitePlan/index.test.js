import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen } from '@testing-library/react';
import { SelectedOnSitePlan } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import userEvent from '@testing-library/user-event';

describe('SelectedOnSitePlan', () => {
  it('should render SelectedOnSitePlan when there is not a selected plan chat', async () => {
    // Arrange
    const seletedPlanChat = {};
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedOnSitePlan
          selectedPlan={seletedPlanChat}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    screen.getByText('onsite_selection.selected_onsite_plan.no_onsite_plan_selected_message');

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(button, 'onsite_selection.selected_onsite_plan.add_to_cart_button'),
    ).toBeInTheDocument();
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(addItem).not.toBeCalled();
  });

  it('should render SelectedOnSitePlan when there is a selected onsite plan', async () => {
    // Arrange
    const seletedOnSitePlan = {
      planId: 1,
      printQty: 500,
      fee: 30,
    };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedOnSitePlan
          selectedPlan={seletedOnSitePlan}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.queryByText('onsite_selection.selected_onsite_plan.no_onsite_plan_selected_message'),
    ).not.toBeInTheDocument();
    screen.getByRole('list');

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(button, 'onsite_selection.selected_onsite_plan.add_to_cart_button'),
    ).toBeInTheDocument(); // because there is not an added item to cart
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(addItem).toBeCalled();
  });

  it('should render SelectedOnSitePlan when click on add to cart button', async () => {
    // Arrange
    const seletedOnSitePlan = {
      planId: 1,
      printQty: 500,
      fee: 30,
    };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedOnSitePlan
          selectedPlan={seletedOnSitePlan}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(button, 'onsite_selection.selected_onsite_plan.add_to_cart_button'),
    ).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(addItem).not.toBeCalled();
    await userEvent.click(button);
    expect(addItem).toBeCalledWith(seletedOnSitePlan);
  });

  it('should render SelectedOnSitePlan when click on remove item button', async () => {
    // Arrange
    const seletedOnSitePlan = {
      planId: 1,
      printQty: 500,
      fee: 30,
    };
    const item = seletedOnSitePlan; // In this case, the slider value and the cart item are the same
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedOnSitePlan
          selectedPlan={seletedOnSitePlan}
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
      getByText(button, 'onsite_selection.selected_onsite_plan.remove_from_cart_button'),
    ).toBeInTheDocument();
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(removeItem).toBeCalled();
  });
});
