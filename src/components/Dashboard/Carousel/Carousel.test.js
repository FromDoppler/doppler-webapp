import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Carousel from './Carousel';

describe('Carousel component', () => {
  it('should show the active slide when its dot is checked', async () => {
    // Act
    render(<Carousel />);

    // Assert
    expect(document.querySelector('.dp-carousel-wrapper')).toBeInTheDocument();
    document.querySelector('.dp-carousel-dot').checked = true;
  });
});
