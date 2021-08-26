import React from 'react';
import { render, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';

describe('Dashboard component', () => {
  afterEach(cleanup);

  it('should show the hero-banner with a title and subtitle', async () => {
    // Act
    const { container } = render(<Dashboard />);

    // Assert
    await waitFor(() => {
      expect(container.querySelector('.hero-banner')).toBeInTheDocument();
      expect(container.querySelector('.hero-banner h2')).toBeInTheDocument();
      expect(container.querySelector('.hero-banner p')).toBeInTheDocument();
    });
  });
});
