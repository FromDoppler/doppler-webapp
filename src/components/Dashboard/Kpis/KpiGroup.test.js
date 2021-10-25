import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { KpiGroup } from './KpiGroup';
import { Kpi } from './Kpi';

describe('KpiGroup component', () => {
  it('should render KpiGroup Component', async () => {
    //act
    render(<KpiGroup {...KpiGroup} />);
    //assert
    expect(screen.getByTestId('dp-dashboard-panel')).toBeInTheDocument();
  });

  it('should show loading when flag is set to loading', async () => {
    //Arrange
    const loading = true;
    //act
    render(<KpiGroup {...KpiGroup} loading={loading} />);
    //assert
    expect(screen.getByTestId('loading-box')).toBeInTheDocument();
  });
});
