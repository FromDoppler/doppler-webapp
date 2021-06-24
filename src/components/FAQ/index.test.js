import React from 'react';
import { render } from '@testing-library/react';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { FAQ } from '.';
import { topics } from './constants';

describe('FAQ component', () => {
  it('should render FAQ component', () => {
    // Act
    const { container } = render(
      <IntlProvider>
        <FAQ topics={topics} />
      </IntlProvider>,
    );

    // Assert
    expect(container.querySelectorAll('.dp-accordion').length).toBe(topics.length);
  });
});
