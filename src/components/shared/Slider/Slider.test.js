import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Slider } from './Slider';

describe('Slider component', () => {
  afterEach(cleanup);

  it('should render the slider', () => {
    // Act
    const mockedFunction = () => null;
    const { container } = render(
      <Slider min={0} max={8} step={1} defaultValue={0} handleChange={mockedFunction} />,
    );

    // Assert
    expect(container.querySelector('input[type="range"]')).toBeInTheDocument();
  });

  it('should execute function when slider changes', () => {
    // Act
    const mockedFunction = jest.fn();
    const { container } = render(
      <Slider min={0} max={8} step={1} defaultValue={0} handleChange={mockedFunction} />,
    );

    const slider = container.querySelector('input[type="range"]');

    fireEvent.change(slider, { target: { value: 2 } });
    // Assert
    expect(mockedFunction).toHaveBeenCalled();
  });
});
