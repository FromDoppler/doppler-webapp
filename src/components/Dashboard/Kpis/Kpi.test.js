import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Kpi } from './Kpi';
import { kpiList } from '../Dashboard';

describe('Kpi component', () => {
  it('should render Kpi Component', async () => {
    //act
    render(<Kpi {...Kpi} />);
    //assert
    expect(screen.getByRole('figure')).toBeInTheDocument();
  });
});
