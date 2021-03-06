import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Slider } from './Slider';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('Slider component', () => {
  afterEach(cleanup);

  it('should render the slider when it is visible', () => {
    // Act
    const mockedFunction = jest.fn();
    const mockedValues = [
      { amount: 1, descriptionId: 'plans.prepaid_amount_description' },
      { amount: 2, descriptionId: 'plans.prepaid_amount_description' },
    ];
    const { container } = render(
      <DopplerIntlProvider>
        <Slider
          planDescriptions={mockedValues}
          defaultValue={0}
          visible={true}
          handleChange={mockedFunction}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(container.querySelector('input[type="range"]')).toBeInTheDocument();
  });

  it('should not render the slider when it is hidden', () => {
    // Act
    const mockedFunction = jest.fn();
    const mockedValues = [
      { amount: 1, descriptionId: 'plans.prepaid_amount_description' },
      { amount: 2, descriptionId: 'plans.prepaid_amount_description' },
    ];
    const { container } = render(
      <DopplerIntlProvider>
        <Slider
          planDescriptions={mockedValues}
          defaultValue={0}
          visible={false}
          handleChange={mockedFunction}
        />
      </DopplerIntlProvider>,
    );

    // Assert
    expect(container.querySelector('input[type="range"]')).not.toBeInTheDocument();
  });

  it('should execute function when slider changes and slider it is visible', () => {
    // Act
    const mockedFunction = jest.fn();
    const mockedValues = [
      { amount: 1, descriptionId: 'plans.prepaid_amount_description' },
      { amount: 2, descriptionId: 'plans.prepaid_amount_description' },
    ];
    const { container } = render(
      <DopplerIntlProvider>
        <Slider
          planDescriptions={mockedValues}
          defaultValue={0}
          visible={true}
          handleChange={mockedFunction}
        />
      </DopplerIntlProvider>,
    );

    const slider = container.querySelector('input[type="range"]');

    fireEvent.change(slider, { target: { value: 2 } });
    // Assert
    expect(mockedFunction).toHaveBeenCalled();
  });
});
