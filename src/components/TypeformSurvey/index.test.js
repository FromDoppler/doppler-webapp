import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TypeformSurvey } from '.';
import { AppServicesProvider } from '../../services/pure-di';

describe('TypeformSurvey', () => {
  it('should render TypeformSurvey component when the user completes the survey', async () => {
    // Arrange
    const getSurveyFormStatusMock = jest.fn(async () => ({
      success: true,
      value: { surveyFormCompleted: true },
    }));
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              lang: 'es',
              fullname: 'Junior Campos',
              email: 'jcampos@makingsense.com',
              plan: {
                isFreeAccount: true,
              },
            },
          },
        },
      },
      dopplerLegacyClient: {
        getSurveyFormStatus: getSurveyFormStatusMock,
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <TypeformSurvey />
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByTestId('empty-fragment')).toBeInTheDocument();

    expect(getSurveyFormStatusMock).toHaveBeenCalled();
    expect(await screen.findByTestId('empty-fragment')).toBeInTheDocument();
  });

  it('should render TypeformSurvey component when the user do not complete the survey', async () => {
    // Arrange
    const getSurveyFormStatusMock = jest.fn(async () => ({
      success: true,
      value: { surveyFormCompleted: false },
    }));
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              lang: 'es',
              fullname: 'Junior Campos',
              email: 'jcampos@makingsense.com',
              plan: {
                isFreeAccount: true,
              },
            },
          },
        },
      },
      dopplerLegacyClient: {
        getSurveyFormStatus: getSurveyFormStatusMock,
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <TypeformSurvey />
      </AppServicesProvider>,
    );

    // Assert

    await waitForElementToBeRemoved(screen.getByTestId('empty-fragment'));
    expect(getSurveyFormStatusMock).toHaveBeenCalled();
    expect(await screen.findByTestId('iframe')).toBeInTheDocument();
  });

  it('should not render TypeformSurvey component when the user does not have a trial account', async () => {
    // Arrange
    const getSurveyFormStatusMock = jest.fn(async () => ({
      success: true,
      value: { surveyFormCompleted: true },
    }));
    const forcedServices = {
      appSessionRef: {
        current: {
          userData: {
            user: {
              lang: 'es',
              fullname: 'Junior Campos',
              email: 'jcampos@makingsense.com',
              plan: {
                isFreeAccount: false,
              },
            },
          },
        },
      },
      dopplerLegacyClient: {
        getSurveyFormStatus: getSurveyFormStatusMock,
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <TypeformSurvey />
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.getByTestId('empty-fragment')).toBeInTheDocument();

    expect(getSurveyFormStatusMock).toHaveBeenCalled();
    expect(await screen.findByTestId('empty-fragment')).toBeInTheDocument();
  });
});
