import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ControlPanel from '../ControlPanel';

describe('Bigquery Control Panel component', () => {
  afterEach(cleanup);

  it('renders bigquery control panel template', () => {
    // Arrange
    const texts = [
      'big_query.plus_beginning',
      'big_query.plus_big_query',
      'big_query.plus_body_step_one_HD',
      'big_query.plus_body_step_two_HD',
      'big_query.plus_btn_cancel',
      'big_query.plus_btn_save',
      'big_query.plus_configuration',
      'big_query.plus_control_panel',
      'big_query.plus_title',
      'big_query.plus_header_MD',
      'big_query.plus_step_one',
      'big_query.plus_body_step_one_HD',
      'big_query.plus_step_one_paragraph',
      'big_query.plus_step_two',
      'big_query.plus_body_step_two_HD',
      'big_query.plus_step_two_paragraph',
    ];

    //act
    const { getByText } = render(
      <IntlProvider>
        <ControlPanel />
      </IntlProvider>,
    );

    //assert
    texts.map((text) => expect(getByText(text)).toBeInTheDocument());
  });

  describe('test click save and cancel button ', () => {
    test('Test click Save button', () => {
      // Arrange
      const { getByTestId } = render(
        <IntlProvider>
          <ControlPanel />
        </IntlProvider>,
      );

      const buttonSave = getByTestId('btn-save');
      //assert
      expect(getByTestId('btn-save')).toBeInTheDocument();
      //act
      fireEvent.click(buttonSave);
      //assert
      expect(getByTestId('message-info').textContent);
    });
  });

  test('Test click Cancel button', () => {
    // Arrange
    const { queryByTestId } = render(
      <IntlProvider>
        <ControlPanel />
      </IntlProvider>,
    );
    //act
    const buttonSave = queryByTestId('btn-save');
    //assert
    expect(queryByTestId('btn-save')).toBeInTheDocument();
    //act
    fireEvent.click(buttonSave);
    //assert
    expect(queryByTestId('message-info').textContent);
    // act
    const buttonCancel = queryByTestId('btn-cancel');
    //assert
    expect(queryByTestId('btn-cancel')).toBeInTheDocument();
    //act
    fireEvent.click(buttonCancel);
    //assert
    expect(queryByTestId('message-info')).toBeNull();
  });
});
