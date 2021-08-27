import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { act } from 'react-dom/test-utils';
import IntlProvider from '../../i18n/DopplerIntlProvider.double-with-ids-as-values';
import ChangePlan, {
  BulletOptions,
  OptionItem,
  BasicBullet,
  BigDataBullet,
  NewLabel,
  StarBullet,
  FreeCard,
  AgenciesCard,
  CardWithPrice,
} from './ChangePlan';
import { MemoryRouter as Router } from 'react-router-dom';
import { AppServicesProvider } from '../../services/pure-di';
import { allPlans } from '../../services/doppler-legacy-client.doubles';

describe('OptionItem component', () => {
  it('should render OptionItem', async () => {
    // Arrange
    const text = 'fake test';

    // Act
    const { container, getByText } = render(
      <OptionItem bullet={<BasicBullet />}>{text}</OptionItem>,
    );

    // Assert
    expect(getByText(text)).toBeInTheDocument();
    expect(container.querySelector('.dp-icodot')).toBeInTheDocument();
  });
});

describe('BasicBullet component', () => {
  it('should render BasicBullet', async () => {
    // Act
    const { container } = render(<BasicBullet />);

    // Assert
    expect(container.querySelector('.dp-icodot')).toBeInTheDocument();
  });
});

describe('BigDataBullet component', () => {
  it('should render BigDataBullet', async () => {
    // Arrange
    const text = 'fake test';

    // Act
    const { getByText } = render(<BigDataBullet>{text}</BigDataBullet>);

    // Assert
    expect(getByText(text)).toBeInTheDocument();
  });
});

describe('NewLabel component', () => {
  it('should render NewLabel', async () => {
    // Arrange
    const text = 'fake test';

    // Act
    const { container } = render(<NewLabel>{text}</NewLabel>);

    // Assert
    expect(container.querySelector('.dp-new')).toHaveTextContent(text);
  });
});

describe('StarBullet component', () => {
  it('should render StarBullet', async () => {
    // Act
    render(
      <IntlProvider>
        <StarBullet />
      </IntlProvider>,
    );
  });
});

describe('FreeCard component', () => {
  it('should render FreeCard when showFeatures is false', async () => {
    // Act
    const { container } = render(
      <IntlProvider>
        <FreeCard />
      </IntlProvider>,
    );

    // Assert
    expect(container.querySelector('.collapse-css-transition')).toHaveStyle('visibility: hidden');
  });

  it('should render FreeCard when showFeatures is true', async () => {
    // Act
    const { container } = render(
      <IntlProvider>
        <FreeCard showFeatures={true} />
      </IntlProvider>,
    );

    // Assert
    expect(container.querySelector('.collapse-css-transition')).not.toHaveStyle(
      'visibility: hidden',
    );
  });
});

describe('AgenciesCard component', () => {
  it('should render AgenciesCard when showFeatures is false', async () => {
    // Act
    const path = {
      type: 'agencies',
      current: 'current test',
    };
    const { container } = render(
      <Router>
        <IntlProvider>
          <AgenciesCard path={path} />
        </IntlProvider>
      </Router>,
    );

    // Assert
    expect(container.querySelector('.collapse-css-transition')).toHaveStyle('visibility: hidden');
  });

  it('should render AgenciesCard when showFeatures is true', async () => {
    // Act
    const path = {
      type: 'agencies',
      current: 'current test',
    };
    const { container } = render(
      <Router>
        <IntlProvider>
          <AgenciesCard path={path} showFeatures={true} />
        </IntlProvider>
      </Router>,
    );

    // Assert
    expect(container.querySelector('.collapse-css-transition')).not.toHaveStyle(
      'visibility: hidden',
    );
  });
});

describe('CardWithPrice component', () => {
  const currentPlanType = 'prepaid';
  const showFeatures = false;

  it('should render CardWithPrice when path type is plus', async () => {
    // Arrange
    const path = {
      type: 'plus',
      current: 'current test',
    };
    const customShowFeatures = true;
    const promoCode = 'fake-code';
    const linkWithPromoCode = `/plan-selection/${path.type}/${currentPlanType}?promo-code=${promoCode}`;

    // Act
    const { getByText, container } = render(
      <Router>
        <IntlProvider>
          <CardWithPrice
            path={path}
            showFeatures={customShowFeatures}
            currentPlanType={currentPlanType}
            promoCode={promoCode}
          />
        </IntlProvider>
      </Router>,
    );

    // Assert
    expect(container.querySelector('.dp-highlighthed')).toBeInTheDocument();
    expect(getByText('change_plan.recommended')).toBeInTheDocument();
    expect(container.querySelector(`a[href='${linkWithPromoCode}']`)).toBeInTheDocument();
    expect(container.querySelector('.collapse-css-transition')).not.toHaveStyle(
      'visibility: hidden',
    );
    expect(container.querySelector('.collapse-css-transition')).not.toHaveTextContent(
      `change_plan.features_title_${path.type}`,
    );
    expect(getByText(`change_plan.features_HTML_${path.type}`)).toBeInTheDocument();
  });

  it('should render CardWithPrice when path type is standard', async () => {
    // Arrange
    const path = {
      type: 'standard',
    };
    const promoCode = 'fake-code';
    const linkWithPromoCode = `/plan-selection/${path.type}?promo-code=${promoCode}`;

    // Act
    const { getByText, container } = render(
      <Router>
        <IntlProvider>
          <CardWithPrice
            path={path}
            showFeatures={showFeatures}
            currentPlanType={currentPlanType}
            promoCode={promoCode}
          />
        </IntlProvider>
      </Router>,
    );

    // Assert
    expect(container.querySelector('.dp-highlighthed')).not.toBeInTheDocument();
    expect(container.querySelector('.dp-content-plans')).not.toHaveTextContent(
      'change_plan.recommended',
    );
    expect(container.querySelector(`a[href='${linkWithPromoCode}']`)).toBeInTheDocument();
    expect(getByText('change_plan.calculate_price')).toBeInTheDocument();
    expect(container.querySelector('.collapse-css-transition')).toHaveStyle('visibility: hidden');
    expect(container.querySelector('.collapse-css-transition')).toHaveTextContent(
      `change_plan.features_title_${path.type}`,
    );
  });

  it('should render CardWithPrice when has not promotion code and path has current', async () => {
    // Arrange
    const path = {
      type: 'standard',
      current: 'fake current',
    };

    // Act
    const { getByText, container } = render(
      <Router>
        <IntlProvider>
          <CardWithPrice
            path={path}
            showFeatures={showFeatures}
            currentPlanType={currentPlanType}
          />
        </IntlProvider>
      </Router>,
    );

    // Assert
    expect(container.querySelector('.dp-highlighthed')).not.toBeInTheDocument();
  });

  it('should render CardWithPrice showing CardPrice', async () => {
    // Arrange
    const path = {
      type: 'standard',
      current: 'fake current',
      minimumFee: 1000,
    };

    // Act
    const { getByText, container } = render(
      <Router>
        <IntlProvider>
          <CardWithPrice
            path={path}
            showFeatures={showFeatures}
            currentPlanType={currentPlanType}
          />
        </IntlProvider>
      </Router>,
    );

    // Assert
    expect(container.querySelector('.dp-highlighthed')).not.toBeInTheDocument();
    expect(container.querySelector('.dp-money-number')).toHaveTextContent('1,000');
    expect(getByText('change_plan.per_month')).toBeInTheDocument();
  });
});

describe('BulletOptions component', () => {
  // Arrange
  const planNames = ['agencies', 'free', 'plus', 'standard'];

  planNames.forEach((plan) => {
    it(`should render BulletOptions when type is ${plan}`, async () => {
      // Act
      const { getByText } = render(
        <Router>
          <IntlProvider>
            <BulletOptions type={plan} />
          </IntlProvider>
        </Router>,
      );

      // Assert
      expect(getByText(`change_plan.features_HTML_${plan}`)).toBeInTheDocument();
    });
  });
});

describe('ChangePlan component', () => {
  afterEach(cleanup);

  it('should render ChangePlan when plans list is empty', async () => {
    // Arrange
    const paths = [];
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {},
            },
          },
        },
      },
      planService: {
        getPlanList: () => [],
        mapCurrentPlanFromTypeOrId: () => ({
          type: 'free',
          subscriberLimit: 500,
          featureSet: 'free',
        }),
        getPaths: () => paths,
      },
    };

    // Act
    const { container } = render(
      <Router>
        <AppServicesProvider forcedServices={dependencies}>
          <IntlProvider>
            <ChangePlan location={{ search: null }} />
          </IntlProvider>
        </AppServicesProvider>
      </Router>,
    );

    // Assert
    const plans = container.querySelectorAll('.dp-card');
    expect(plans.length).toBe(paths.length);
    expect(container).not.toHaveTextContent('change_plan.title');
    expect(container.querySelector('.loading-page')).toBeInTheDocument();
  });

  it('should render ChangePlan when has plans list', async () => {
    // Arrange
    const pricePlansByType = {
      standard: 15,
      plus: 30,
      agencies: 45,
    };
    const complementariesPaths = Object.keys(pricePlansByType).map((path) => ({
      current: false,
      minimumFee: pricePlansByType[path],
      type: path,
    }));
    const paths = [
      {
        type: 'free',
        current: true,
      },
      ...complementariesPaths,
    ];
    const dependencies = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              plan: {
                id: 0,
                planType: 'free',
              },
            },
          },
        },
      },
      planService: {
        getPlanList: () => allPlans,
        mapCurrentPlanFromTypeOrId: () => ({
          type: 'free',
          subscriberLimit: 500,
          featureSet: 'free',
        }),
        getPaths: () => paths,
      },
    };

    // Act
    let result;
    await act(async () => {
      result = render(
        <Router>
          <AppServicesProvider forcedServices={dependencies}>
            <IntlProvider>
              <ChangePlan location={{ search: null }} />
            </IntlProvider>
          </AppServicesProvider>
        </Router>,
      );
    });

    const { container, getByText } = result;

    // Assert
    const plans = container.querySelectorAll('.dp-card');
    expect(plans.length).toBe(paths.length);

    const freePlan = plans[0];
    expect(freePlan).toHaveTextContent('change_plan.card_free_title');
    expect(freePlan).toHaveTextContent(`change_plan.current_plan`);
    expect(freePlan.querySelector('.collapse-css-transition')).toHaveStyle('visibility: hidden');

    const standardPlan = plans[1];
    expect(standardPlan).toHaveTextContent('change_plan.card_standard_title');
    expect(standardPlan).toHaveTextContent(pricePlansByType['standard']);
    expect(standardPlan.querySelector('.collapse-css-transition')).toHaveStyle(
      'visibility: hidden',
    );

    const plusPlan = plans[2];
    expect(plusPlan).toHaveTextContent('change_plan.card_plus_title');
    expect(plusPlan).toHaveTextContent(pricePlansByType['plus']);
    expect(plusPlan.querySelector('.collapse-css-transition')).toHaveStyle('visibility: hidden');

    const agenciesPlan = plans[3];
    expect(agenciesPlan).toHaveTextContent('change_plan.card_agencies_title');
    expect(agenciesPlan.querySelector('.collapse-css-transition')).toHaveStyle(
      'visibility: hidden',
    );

    act(() => {
      const toggleButton = getByText('change_plan.show_features');
      fireEvent.click(toggleButton);
    });

    await waitFor(() => {
      plans.forEach((plan) =>
        expect(plan.querySelector('.collapse-css-transition')).not.toHaveStyle(
          'visibility: hidden',
        ),
      );
    });
  });
});
