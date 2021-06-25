import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import MultiInputContainer from '../MultiInputContainer';
import ControlPanel from '../ControlPanel';

describe('test for validate multi input email component ', () => {
  test('Test Html Structure', () => {
    // Arrange
    const texts = ['+'];

    // act
    const { getByText } = render(
      <IntlProvider>
        <MultiInputContainer />
      </IntlProvider>,
    );

    //assert
    texts.map((text) => expect(getByText(text)).toBeInTheDocument());
  });

  test('Test btn add in document', () => {
    // Arrange
    const { getByTestId } = render(
      <IntlProvider>
        <MultiInputContainer />
      </IntlProvider>,
    );

    const buttonSave = getByTestId('btn-add');
    //assert
    expect(getByTestId('btn-add')).toBeInTheDocument();
  });

  test('Test btn add click when field empty', () => {
    // Arrange
    const { getByTestId } = render(
      <IntlProvider>
        <MultiInputContainer />
      </IntlProvider>,
    );
    //act
    const buttonAdd = getByTestId('btn-add');
    //assert
    expect(getByTestId('btn-add')).toBeInTheDocument();

    //act
    fireEvent.click(buttonAdd);

    // Arrange
    const { getByText } = render(
      <IntlProvider>
        <MultiInputContainer />
      </IntlProvider>,
    );
    //assert
    expect(getByText('big_query.plus_error_message_empty')).toBeInTheDocument();
  });

  test('Test btn add click when field is not email', () => {
    const onChange = jest.fn();

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
    fireEvent.change(emptyInput, { target: { value: 'text not email' } });
    fireEvent.click(buttonAdd);
    const { getByText } = render(
      <IntlProvider>
        <MultiInputContainer />
      </IntlProvider>,
    );
    expect(getByText('big_query.plus_error_message_not_email')).toBeInTheDocument();
  });

  test('Test btn add click when field is email', () => {
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
    expect(emptyInput.value).toBe('test@gmail.com');
  });
});
