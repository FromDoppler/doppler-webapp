import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Switch } from './Switch';

describe('Switch component', () => {
  afterEach(cleanup);

  it('should render the switch', () => {
    // Act
    const mockedFunction = () => null;
    const { getByRole } = render(<Switch id="switch-for-testing" onChange={mockedFunction} />);

    const switchButton = getByRole('checkbox');

    // Assert
    expect(switchButton).toBeInTheDocument();
  });

  it('should execute function when switch changes', () => {
    // Act
    const mockedFunction = jest.fn();
    const { getByRole } = render(<Switch id="switch-for-testing" onChange={mockedFunction} />);

    const switchButton = getByRole('checkbox');
    fireEvent.click(switchButton);

    // Assert
    expect(mockedFunction).toHaveBeenCalled();
  });
});
