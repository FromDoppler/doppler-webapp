import { render, screen } from '@testing-library/react';
import { ActionBox } from '.';
import '@testing-library/jest-dom/extend-expect';
import {
  COMPLETED_STATUS,
  INFO_BY_STATE,
  PENDING_STATUS,
  WARNING_STATUS,
} from '../reducers/firstStepsReducer';
import IntlProvider from '../../../../i18n/DopplerIntlProvider.double-with-ids-as-values';

const initialStepData = {
  status: PENDING_STATUS,
  titleId: 'dashboard.first_steps.has_campaings_created_title',
  descriptionId: 'dashboard.first_steps.has_campaings_created_description_MD',
  textStep: 1,
};

describe('ActionBox component', () => {
  it('should render ActionBox component', () => {
    // Arrange
    const props = {
      ...initialStepData,
    };

    // Act
    render(
      <IntlProvider>
        <ActionBox {...props} />
      </IntlProvider>,
    );

    // Arrange
    expect(screen.getByText(props.titleId)).toBeInTheDocument();
    expect(screen.getByText(props.descriptionId)).toBeInTheDocument();
  });

  describe.each([
    ['should render ActionBox component when status is pending', PENDING_STATUS],
    ['should render ActionBox component when status is complete', COMPLETED_STATUS],
    ['should render ActionBox component when status is warning', WARNING_STATUS],
  ])('different states', (testName, status) => {
    it(testName, () => {
      // Arrange
      const props = {
        ...initialStepData,
        status,
        textStep: 2,
      };

      // Act
      const { container } = render(
        <IntlProvider>
          <ActionBox {...props} />
        </IntlProvider>,
      );

      // Arrange
      expect(container.querySelector(`.${INFO_BY_STATE[status].classNames}`)).toBeInTheDocument();
      if (props.status === PENDING_STATUS) {
        expect(screen.getByText(props.textStep)).toBeInTheDocument();
      }
    });
  });
});
