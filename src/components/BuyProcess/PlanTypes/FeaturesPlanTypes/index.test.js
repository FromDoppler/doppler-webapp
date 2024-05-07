import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ANCHOR_ITEMS, FeaturesPlanTypes } from '.';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { BrowserRouter } from 'react-router-dom';

describe('FeaturesPlanTypes', () => {
  it('should render FeaturesPlanTypes', async () => {
    // Act
    render(
      <BrowserRouter>
        <IntlProvider>
          <FeaturesPlanTypes />
        </IntlProvider>
      </BrowserRouter>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(ANCHOR_ITEMS.length);
  });
});
