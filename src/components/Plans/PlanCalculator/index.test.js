import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { PlanCalculator } from '.';

describe('PlanCalculator component', () => {
  it('should render PlanCalculator', () => {
    render(<PlanCalculator />);
  });
});
