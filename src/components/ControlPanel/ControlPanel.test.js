import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ControlPanel } from './ControlPanel';

describe('Control Panel component', () => {
  it('should show the hero-banner with a title', async () => {
    render(<ControlPanel />);

    const header = screen.getByRole('banner');
    const title = screen.getByRole('heading');

    expect(header).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });
});
