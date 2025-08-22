import { BrowserRouter } from "react-router-dom";
import { CancellationWithoutRetentionModal } from ".";
import { AppServicesProvider } from "../../../../../services/pure-di";
import { IntlProvider } from "react-intl";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';

describe('CancellationWithoutRetentionModal component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <CancellationWithoutRetentionModal />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.cancellation.without_retention_modal.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.without_retention_modal.description'),
    ).toBeInTheDocument();
  });
})