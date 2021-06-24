import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { QAItem } from '.';
import { FormattedMessage } from 'react-intl';
import { FormattedMessageMarkdown } from '../../../i18n/FormattedMessageMarkdown';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('QAItem component', () => {
  it('should render QAItem component', () => {
    // Arrange
    const question = 'faq.question_1';
    const answer = 'faq.answer_1';

    // Act
    const { getByText } = render(
      <IntlProvider>
        <QAItem
          question={<FormattedMessage id={question} />}
          answer={<FormattedMessageMarkdown id={answer} />}
        />
      </IntlProvider>,
    );

    // Assert
    expect(getByText(question)).toBeInTheDocument();
    expect(getByText(answer)).toBeInTheDocument();
  });
});
