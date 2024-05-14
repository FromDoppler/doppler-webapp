import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PlanTypeCard } from '.';
import { PLAN_TYPE } from '../../../../doppler-types';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

describe('PlanTypeCard', () => {
  it('should render PlanTypeCard when is argentina discount and is a free account', async () => {
    // Arrange
    const props = {
      planType: PLAN_TYPE.free,
      pathname: `/plan-selection/premium/${PLAN_TYPE.byContact}`,
      planName: 'Contacts',
      description: 'a description',
      comment: 'a comment',
      ribbonText: 'argentina discount',
      features: ['item 1', 'item 2'],
      minPrice: 8,
      minPriceWithDiscount: 6.4,
      isArgentina: true,
      discountPercentage: 20,
    };

    // Act
    render(
      <BrowserRouter>
        <IntlProvider>
          <PlanTypeCard {...props} />
        </IntlProvider>
      </BrowserRouter>,
    );

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent(props.ribbonText);
    expect(screen.getByRole('button', { name: 'plan_types.actual_plan' })).toBeDisabled();
    expect(screen.queryByText('plan_types.discount_argentina_label')).not.toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(props.features.length);
  });

  it('should render PlanTypeCard when is argentina discount and is a paid account', async () => {
    // Arrange
    const props = {
      planType: PLAN_TYPE.byContact,
      pathname: `/plan-selection/premium/${PLAN_TYPE.byContact}`,
      planName: 'Contacts',
      description: 'a description',
      comment: 'a comment',
      ribbonText: 'argentina discount',
      features: ['item 1', 'item 2'],
      minPrice: 8,
      minPriceWithDiscount: 6.4,
      isArgentina: true,
      discountPercentage: 20,
    };

    // Act
    render(
      <BrowserRouter>
        <IntlProvider>
          <PlanTypeCard {...props} />
        </IntlProvider>
      </BrowserRouter>,
    );

    // Assert
    expect(screen.getByRole('alert')).toHaveTextContent(props.ribbonText);
    expect(
      screen.queryByRole('button', { name: 'plan_types.actual_plan' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('plan_types.discount_argentina_label')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(props.features.length);
  });
});
