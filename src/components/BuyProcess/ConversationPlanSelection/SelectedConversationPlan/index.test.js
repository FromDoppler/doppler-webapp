import '@testing-library/jest-dom/extend-expect';
import { getByText, render, screen } from '@testing-library/react';
import { SelectedConversationPlan } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import userEvent from '@testing-library/user-event';

describe('SelectedConversationPlan', () => {
  it('should render SelectedConversationPlan when there is not a selected plan chat', async () => {
    // Arrange
    const seletedPlanChat = { conversationsQty: 0 };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedConversationPlan
          selectedPlan={seletedPlanChat}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    screen.getByText('chat_selection.selected_plan_chat.no_chat_plan_selected_message');

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(button, 'chat_selection.selected_plan_chat.add_to_cart_button'),
    ).toBeInTheDocument();
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(addItem).not.toBeCalled();
  });

  it('should render SelectedConversationPlan when there is a selected onsite plan', async () => {
    // Arrange
    const seletedPlanChat = {
      planId: 1,
      conversationsQty: 500,
      fee: 30,
      additional: 5,
    };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedConversationPlan
          selectedPlan={seletedPlanChat}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert
    expect(
      screen.queryByText('chat_selection.selected_plan_chat.no_chat_plan_selected_message'),
    ).not.toBeInTheDocument();
    screen.getByRole('list');

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(button, 'chat_selection.selected_plan_chat.add_to_cart_button'),
    ).toBeInTheDocument(); // because there is not an added item to cart
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(addItem).toBeCalled();
  });

  it('should render SelectedConversationPlan when click on add to cart button', async () => {
    // Arrange
    const seletedPlanChat = {
      planId: 1,
      conversationsQty: 500,
      fee: 30,
      additional: 5,
    };
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedConversationPlan
          selectedPlan={seletedPlanChat}
          addItem={addItem}
          removeItem={removeItem}
        />
      </IntlProvider>,
    );

    // Assert

    // click on button
    const button = screen.getByRole('button');
    expect(
      getByText(button, 'chat_selection.selected_plan_chat.add_to_cart_button'),
    ).toBeInTheDocument();
    expect(button).toBeEnabled();
    expect(addItem).not.toBeCalled();
    await userEvent.click(button);
    expect(addItem).toBeCalledWith(seletedPlanChat);
  });

  it('should render SelectedConversationPlan when click on remove item button', async () => {
    // Arrange
    const seletedPlanChat = {
      planId: 1,
      conversationsQty: 500,
      fee: 30,
      additional: 5,
      agents: 1,
      channels: 1,
    };
    const item = seletedPlanChat; // In this case, the slider value and the cart item are the same
    const addItem = jest.fn();
    const removeItem = jest.fn();

    // Act
    render(
      <IntlProvider>
        <SelectedConversationPlan
          selectedPlan={seletedPlanChat}
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
      getByText(button, 'chat_selection.selected_plan_chat.remove_from_cart_button'),
    ).toBeInTheDocument();
    expect(button).toBeEnabled();
    await userEvent.click(button);
    expect(removeItem).toBeCalled();
  });
});
