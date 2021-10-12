import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Dashboard, kpiListFake } from './Dashboard';

describe('Dashboard component', () => {
  it('should show the hero-banner', async () => {
    render(<Dashboard />);

    const header = screen.getByRole('banner');

    expect(header).toBeInTheDocument();
  });
  it('should render Campaings and Subscribers KpiGroup Component', async () => {
    //act
    render(<Dashboard />);
    //assert
    expect(screen.getAllByRole('figure')).toHaveLength(
      kpiListFake.Campaings.length + kpiListFake.Subscribers.length,
    );
  });
});
