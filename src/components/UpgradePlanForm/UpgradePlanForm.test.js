import React from 'react';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import UpgradePlanForm from './UpgradePlanForm';
import DopplerIntlProvider from '../../DopplerIntlProvider.double-with-ids-as-values';

describe('UpgradePlanForm', () => {
  beforeEach(cleanup);

  it('should show loading text while waiting for AJAX', () => {
    const { getByText } = render(
      <DopplerIntlProvider>
        <UpgradePlanForm isSubscriber={true} />
      </DopplerIntlProvider>,
    );
    getByText('loading');
  });
});
