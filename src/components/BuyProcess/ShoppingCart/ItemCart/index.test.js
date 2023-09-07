import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { ItemCart } from '.';

describe('ItemCart', () => {
  it("should render ItemCart component when don't show billing cycle", async () => {
    // Arrange
    const props = {
      name: 'Marketing Plan',
      featureList: ['Include 500 contacts'],
      billingList: [
        { label: 'Save 25%', amount: 'US $56,00*', strike: true },
        { label: 'Yearly billing', amount: 'US$ 432,00*' },
      ],
    };

    // Act
    render(<ItemCart {...props} />);

    // Assert
    screen.getByText(props.name);

    props.featureList.forEach((featureItem) => {
      screen.getByText(featureItem);
    });
    props.billingList.forEach((billingItem) => {
      screen.getByText(billingItem.label);
    });
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument();
  });

  it('should render ItemCart component when show billing cycle and is removible', async () => {
    // Arrange
    const removeFake = jest.fn();
    const props = {
      name: 'Chat plan',
      featureList: ['1.000 conversations'],
      billingList: [
        { label: 'Save 25%', amount: 'US$ 288,00*', strike: true },
        { label: 'Yearly billing', amount: 'US$ 216,00*' },
      ],
      isRemovible: true,
      handleRemove: removeFake,
      data: {
        name: 1000,
        price: 25,
      },
    };

    // Act
    render(<ItemCart {...props} />);

    // Assert
    expect(removeFake).not.toBeCalled();

    const removeButton = screen.queryByRole('button', { name: 'remove' });
    await act(() => userEvent.click(removeButton));
    expect(removeFake).toHaveBeenCalledWith(props.data);
  });
});
