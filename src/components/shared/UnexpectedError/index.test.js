import { render, screen } from '@testing-library/react';
import { UnexpectedError } from '.';
import DopplerIntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('UnexpectedError', () => {
  it('should render UnexpectedError component', async () => {
    // Arrange
    const msgId = 'common.something_wrong';

    // Act
    render(
      <DopplerIntlProvider>
        <UnexpectedError msgId={msgId} />
      </DopplerIntlProvider>,
    );

    // Assert
    screen.getByText(msgId);
  });

  it('should render UnexpectedError component when has msg', async () => {
    // Arrange
    const msg = 'Ouch! something wrong!';

    // Act
    render(
      <DopplerIntlProvider>
        <UnexpectedError msg={msg} />
      </DopplerIntlProvider>,
    );

    // Assert
    screen.getByText(msg);
  });
});
