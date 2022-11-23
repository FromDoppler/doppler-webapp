import { render, screen } from '@testing-library/react';
import { ActionBox } from '.';
import '@testing-library/jest-dom/extend-expect';
import { COMPLETED_STATUS, PENDING_STATUS } from '../../reducers/firstStepsReducer';
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

  it('should render ActionBox component when status is pending', () => {
    // Arrange
    const props = {
      ...initialStepData,
      status: PENDING_STATUS,
      textStep: 1,
    };

    // Act
    const { container } = render(
      <IntlProvider>
        <ActionBox {...props} />
      </IntlProvider>,
    );

    // Arrange
    expect(container.querySelector(`.dp-checked`)).not.toBeInTheDocument();
    expect(screen.getByText(props.textStep)).toBeInTheDocument();
  });

  it('should render ActionBox component when status is complete', () => {
    // Arrange
    const props = {
      ...initialStepData,
      status: COMPLETED_STATUS,
      textStep: 1,
    };

    // Act
    const { container } = render(
      <IntlProvider>
        <ActionBox {...props} />
      </IntlProvider>,
    );

    // Arrange
    expect(container.querySelector(`.dp-checked`)).toBeInTheDocument();
    expect(screen.queryByText(props.textStep)).not.toBeInTheDocument();
  });
});
