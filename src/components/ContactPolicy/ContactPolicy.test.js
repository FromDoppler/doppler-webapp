import React from 'react';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom/extend-expect';
import DopplerIntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { ContactPolicy } from './ContactPolicy';

describe('ContactPolicy component', () => {
  afterEach(cleanup);

  const ContactPolicyComponent = () => (
    <DopplerIntlProvider>
      <ContactPolicy />
    </DopplerIntlProvider>
  );

  it('should disable the inputs if the switch is not active', async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);

    const switchButton = container.querySelector('input#contact-policy-switch');
    const inputAmount = container.querySelector('input#contact-policy-input-amount');
    const inputInterval = container.querySelector('input#contact-policy-input-interval');

    // Assert
    expect(switchButton).not.toBeChecked();
    expect(inputAmount).toBeDisabled();
    expect(inputInterval).toBeDisabled();
  });

  it("shouldn't disable the inputs if the switch is active", async () => {
    // Act
    const { container } = render(<ContactPolicyComponent />);
    const switchButton = container.querySelector('input#contact-policy-switch');
    act(() => {
      fireEvent.click(switchButton);
    });

    const inputAmount = container.querySelector('input#contact-policy-input-amount');
    const inputInterval = container.querySelector('input#contact-policy-input-interval');

    // Assert
    await waitFor(() => {
      expect(switchButton).toBeChecked();
      expect(inputAmount).not.toBeDisabled();
      expect(inputInterval).not.toBeDisabled();
    });
  });
});
