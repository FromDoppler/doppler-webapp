import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { TypeformSurvey } from '.';
import { AppServicesProvider } from '../../services/pure-di';

describe('TypeformSurvey', () => {
  it('should render TypeformSurvey component when typeformEnabled is false', async () => {
    // Arrange
    const typeformEnabled = false;
    const forcedServices = {
      experimentalFeatures: {
        getFeature: () => typeformEnabled,
      },
    };

    // Act
    render(
      <AppServicesProvider forcedServices={forcedServices}>
        <TypeformSurvey />
      </AppServicesProvider>,
    );

    // Assert
    expect(screen.queryByTestId('tf-v1-popup')).not.toBeInTheDocument();
  });

  it('should render TypeformSurvey component when typeformEnabled is true', async () => {
    // Arrange
    const getSurveyFormStatusMock = jest.fn(async () => ({ success: true, value: true }));
    const typeformEnabled = true;
    const forcedServices = {
      experimentalFeatures: {
        getFeature: () => typeformEnabled,
      },
      appSessionRef: {
        current: {
          userData: {
            user: {
              lang: 'es',
              fullname: 'Junior Campos',
              email: 'jcampos@makingsense.com',
            },
          },
        },
      },
      surveyClient: {
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
    expect(screen.getByTestId('iframe')).toBeInTheDocument();
  });
});
