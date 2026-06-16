import '@testing-library/jest-dom/extend-expect';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import IntlProvider from '../../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import { AppServicesProvider } from '../../../../../services/pure-di';
import { AddOnType } from '../../../../../doppler-types';
import { AddOnCancellationFlow } from '.';

describe('AddOnCancellationFlow component', () => {
  it('should open the cancellation modal and show success after confirming', async () => {
    const cancellationAddOnPlan = jest.fn(async () => ({ success: true }));
    const user = userEvent.setup({ delay: null });

    render(
      <AppServicesProvider
        forcedServices={{
          dopplerBillingUserApiClient: {
            cancellationAddOnPlan,
          },
        }}
      >
        <BrowserRouter>
          <IntlProvider>
            <AddOnCancellationFlow addOnType={AddOnType.OnSite} canCancel />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'cancel-plan' }));
    });

    expect(screen.getByText('my_plan.cancellation.addon_modal.title')).toBeInTheDocument();

    await act(async () => {
      await user.click(
        screen.getByRole('button', { name: 'my_plan.cancellation.addon_modal.accept_button' }),
      );
    });

    expect(cancellationAddOnPlan).toHaveBeenCalledWith(AddOnType.OnSite);
    expect(
      screen.getByText('my_plan.cancellation.success_addon_cancellation.title'),
    ).toBeInTheDocument();
  });
});
