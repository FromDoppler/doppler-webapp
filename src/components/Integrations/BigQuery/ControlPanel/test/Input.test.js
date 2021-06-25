import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import Input from '../Input';
import MultiInputContainer from '../MultiInputContainer';
import ControlPanel from '../ControlPanel';

describe('test for validate input email component ', () => {
  test('Validate empty input', () => {
    const { getByTestId } = render(
      <IntlProvider>
        <Input />
      </IntlProvider>,
    );

    const emptyInput = screen.getByTestId('email-input');
    expect(emptyInput.value).toBe('');
  });

  test('Validate exists remove button', () => {
    // Arrange
    const { getByTestId } = render(
      <IntlProvider>
        <ControlPanel />
      </IntlProvider>,
    );
    //act
    const buttonAdd = getByTestId('btn-add');
    //assert
    expect(getByTestId('btn-add')).toBeInTheDocument();

    const emptyInput = screen.getByTestId('email-input');
    fireEvent.change(emptyInput, { target: { value: 'test@gmail.com' } });
    fireEvent.click(buttonAdd);
    screen.debug();
    const buttonRemove = getByTestId('btn-remove');
    expect(getByTestId('btn-remove')).toBeInTheDocument();
  });

  test('Validate remove button click', () => {
    // Arrange
    const { getByTestId } = render(
      <IntlProvider>
        <ControlPanel />
      </IntlProvider>,
    );
    //act
    const buttonAdd = getByTestId('btn-add');
    expect(getByTestId('btn-add')).toBeInTheDocument();
    const emptyInput = screen.getByTestId('email-input');
    fireEvent.change(emptyInput, { target: { value: 'test@gmail.com' } });
    fireEvent.click(buttonAdd);
    screen.debug();
    const buttonRemove = getByTestId('btn-remove');
    fireEvent.click(buttonRemove);

    const { queryByTestId } = render(
      <IntlProvider>
        <ControlPanel />
      </IntlProvider>,
    );

    //assert
    expect(queryByTestId('btn-remove')).toBeNull();
  });
});
