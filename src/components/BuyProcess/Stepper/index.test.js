import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Stepper } from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import IntlProvider from '../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('Stepper', () => {
  it('should render Stepper component', async () => {
    // Arrange
    const steps = [
      {
        label: 'buy_process.stepper.email_marketing_plan_step',
        icon: '',
        pathname: '/plan-selection/premium/by-contacts',
      },
      {
        label: 'buy_process.stepper.conversation_plan_step',
        icon: '',
        pathname: '/chat-plan',
      },
      {
        label: 'buy_process.stepper.finalize_purchase_step',
        icon: '',
        pathname: '/checkout',
      },
    ];

    // Act
    render(
      <IntlProvider>
        <Router initialEntries={[`/plan-selection/premium/${URL_PLAN_TYPE[PLAN_TYPE.byContact]}`]}>
          <Routes>
            <Route path="/plan-selection/premium/:planType" element={<Stepper steps={steps} />} />
          </Routes>
        </Router>
        ,
      </IntlProvider>,
    );
  });
});
