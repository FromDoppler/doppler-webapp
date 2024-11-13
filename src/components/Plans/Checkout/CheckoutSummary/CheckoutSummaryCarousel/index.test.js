import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import { CheckoutSummaryCarousel } from '.';

describe('CheckoutSummaryCarousel', () => {
  it('should show title children', async () => {
    const slideText = 'Testing slide';

    await act(async () => {
      render(
        <CheckoutSummaryCarousel id="1" ariaLabel="addons-packs" numberOfItems={1} showDots={false}>
          {({ activeSlide }) => <h1>{slideText}</h1>}
        </CheckoutSummaryCarousel>,
      );
    });

    // Assert
    expect(screen.getByText(slideText)).toBeInTheDocument();
  });
});
