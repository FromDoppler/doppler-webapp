import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { StarsScore } from './StarsScore';

describe('Stars score component', () => {
  afterEach(cleanup);

  it('renders stars with score 0', () => {
    // Act
    const { container } = render(<StarsScore score={0} />);

    // Assert
    expect(container.querySelector('.icon-star-filled')).toBeInTheDocument();
    expect(container.querySelector('.icon-star')).not.toBeInTheDocument();
  });

  it('renders stars with score 3', () => {
    // Act
    const { container } = render(<StarsScore score={3} />);

    // Assert
    expect(container.querySelector('.icon-star-filled')).not.toBeInTheDocument();
    expect(container.querySelector('.icon-star')).toBeInTheDocument();
  });
});
