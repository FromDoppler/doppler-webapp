import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

import { FreeAccount } from './index.tsx';

describe('Bigquery FreeAccount component', () => {
  afterEach(cleanup);

  it('renders bigquery free account button', () => {
    // Arrange
    const texts = [
      'big_query.free_btn_redirect',
      'big_query.free_text_summary',
      'big_query.free_text_strong',
      'big_query.free_ul_item_insights',
      'big_query.free_ul_item_filter',
      'big_query.free_title',
    ];

    //act
    const { getByText } = render(
      <IntlProvider>
        <FreeAccount />
      </IntlProvider>,
    );

    //assert
    texts.map((text) => expect(getByText(text)).toBeInTheDocument());
  });
});
