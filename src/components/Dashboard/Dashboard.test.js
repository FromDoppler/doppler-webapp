import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Dashboard } from './Dashboard';

describe('Dashboard component', () => {
  it('should show the hero-banner', async () => {
    render(<Dashboard />);

    const header = screen.getByRole('banner');

    expect(header).toBeInTheDocument();
  });
});
