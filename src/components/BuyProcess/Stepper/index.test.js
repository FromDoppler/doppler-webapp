import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Stepper } from '.';
import { PLAN_TYPE, URL_PLAN_TYPE } from '../../../doppler-types';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

describe('Stepper', () => {
  it('should render Stepper component', async () => {
    // Arrange
    const steps = [
      {
        label: 'Marketing plan',
        icon: '',
        pathname: '/plan-selection/premium/by-contacts',
      },
      {
        label: 'Chat plan',
        icon: '',
        pathname: '/chat-plan',
      },
      {
        label: 'Checkout',
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
