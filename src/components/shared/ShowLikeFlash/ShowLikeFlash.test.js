import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { ShowLikeFlash } from './ShowLikeFlash.js';
import { successMessageDelay } from '../../../utils';

describe('ShowLikeFlash component', () => {
  const children = <p data-testid="child">A child element</p>;
  jest.useFakeTimers();

  it('should hide children elements after delay', () => {
    // Act
    render(<ShowLikeFlash delay={successMessageDelay}>{children}</ShowLikeFlash>);
    // Assert
    expect(screen.getByTestId('child')).toBeInTheDocument();
    jest.advanceTimersByTime(successMessageDelay);
    waitForElementToBeRemoved(screen.getByTestId('child'));
  });

  it("shouldn't hide children elements if delay is not set", async () => {
    // Act
    render(<ShowLikeFlash>{children}</ShowLikeFlash>);
    // Assert
    expect(screen.getByTestId('child')).toBeInTheDocument();
    jest.advanceTimersByTime(successMessageDelay);
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
