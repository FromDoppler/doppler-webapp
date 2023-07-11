import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { ItemCart } from '.';

describe('ItemCart', () => {
  it("should render ItemCart component when don't show billing cycle", async () => {
    // Arrange
    const props = {
      name: 'Email Plan',
      featureList: ['500 contacts'],
      isRemovible: false,
      item: {
        name: '500 contacts',
        price: 8,
      },
    };

    // Act
    render(<ItemCart {...props} />);

    // Assert
    screen.getByText(props.name);

    props.featureList.forEach((featureItem) => {
      screen.getByText(featureItem);
    });
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument();
  });

  it('should render ItemCart component when show billing cycle and is removible', async () => {
    // Arrange
    const removeFake = jest.fn();
    const props = {
      name: 'Chat plan',
      featureList: ['1.000 conversations'],
      isRemovible: true,
      handleRemove: removeFake,
      billing: {
        label: 'Monthly billing',
        amount: 'US$25',
      },
      item: {
        name: 1000,
        price: 25,
      },
    };

    // Act
    render(<ItemCart {...props} />);

    // Assert
    expect(removeFake).not.toBeCalled();

    screen.getByText(props.name);

    props.featureList.forEach((featureItem) => {
      screen.getByText(featureItem);
    });
    screen.getByText(/Monthly billing/i);
    screen.getByText(/US\$25/i);

    const removeButton = screen.queryByRole('button', { name: 'remove' });
    await act(() => userEvent.click(removeButton));
    expect(removeFake).toHaveBeenCalledWith(props.item);
  });
});
