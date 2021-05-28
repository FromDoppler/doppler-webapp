import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

import FreeAccount from './FreeAccount.tsx';

describe('Bigquery FreeAccount component', () => {
  afterEach(cleanup);

  it('renders bigquery free account button', () => {
    const { getByText } = render(
      <IntlProvider>
        <FreeAccount />
      </IntlProvider>,
    );
    expect(getByText('big_query.free_text_summary')).toBeInTheDocument();
    expect(getByText('big_query.free_btn_redirect')).toBeInTheDocument();
    expect(getByText('big_query.free_ul_item_one')).toBeInTheDocument();
    expect(getByText('big_query.free_ul_item_two')).toBeInTheDocument();
    expect(getByText('big_query.free_title')).toBeInTheDocument();
    expect(getByText('big_query.free_text_strong')).toBeInTheDocument();
  });
});
