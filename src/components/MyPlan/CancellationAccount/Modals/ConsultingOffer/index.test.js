import { BrowserRouter } from "react-router-dom";
import { ConsultingOffer } from ".";
import { AppServicesProvider } from "../../../../../services/pure-di";
import { IntlProvider } from "react-intl";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';

describe('ConsultingOffer component', () => {
  it('should render component', () => {
    // Act
    render(
      <AppServicesProvider>
        <BrowserRouter>
          <IntlProvider>
            <ConsultingOffer />
          </IntlProvider>
        </BrowserRouter>
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByText('my_plan.cancellation.consulting_offer.title')).toBeInTheDocument();
    expect(
      screen.getByText('my_plan.cancellation.consulting_offer.description'),
    ).toBeInTheDocument();
  });
})