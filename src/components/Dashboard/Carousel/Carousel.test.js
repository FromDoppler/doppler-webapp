import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Carousel from './Carousel';

describe('Carousel component', () => {
  it('should show the active slide when its dot is checked', async () => {
    render(<Carousel />);

    expect(document.querySelector('.active')).toBeInTheDocument();

    document.querySelector('.dp-carousel-dot').checked = true;
  });
});
