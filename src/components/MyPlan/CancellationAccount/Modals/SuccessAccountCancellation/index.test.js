import { BrowserRouter } from "react-router-dom";
import { SuccessAccountCancellation } from ".";
import { AppServicesProvider } from "../../../../../services/pure-di";
import { IntlProvider } from "react-intl";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';

describe('SuccessAccountCancellation component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <SuccessAccountCancellation />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.cancellation.success_account_cancellation.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.success_account_cancellation.description'),
    ).toBeInTheDocument();
  });
})