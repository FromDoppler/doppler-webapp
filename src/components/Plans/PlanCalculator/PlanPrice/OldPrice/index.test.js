import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { OldPrice } from '.';
import { PLAN_TYPE } from '../../../../../doppler-types';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('OldPrice', () => {
  it('should render price without discount when percentage is greather to 0', () => {
    // Arrange
    const selectedPlan = {
      type: PLAN_TYPE.byContact,
      fee: 30,
    };

    // Act
    render(
      <IntlProvider>
        <OldPrice selectedPlan={selectedPlan} />
      </IntlProvider>,
    );

    // Assert
    expect(screen.getByText(selectedPlan.fee)).toBeInTheDocument();
  });
});
