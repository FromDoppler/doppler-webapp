import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Slide from './Slide';

describe('Slide component', () => {
  it('should show the slide', async () => {
    // Act
    render(<Slide />);

    // Assert
    expect(document.querySelector('.dp-carousel-slide')).toBeInTheDocument();
  });
});
