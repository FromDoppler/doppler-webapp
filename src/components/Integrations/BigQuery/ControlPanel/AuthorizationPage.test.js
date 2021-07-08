import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AuthorizationPage } from './AuthorizationPage';
import { act } from 'react-dom/test-utils';

describe('test for validate authorization form component ', () => {
  test('Validate loading message disappear', () => {
    // Arrange
    jest.useFakeTimers();
    const { container } = render(
      <IntlProvider>
        <AuthorizationPage />
      </IntlProvider>,
    );

    expect(container.getElementsByClassName('wrapper-loading').length).toBe(1);

    // Act
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Assert
    expect(container.getElementsByClassName('wrapper-loading').length).toBe(0);
  });
});
