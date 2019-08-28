import { ExperimentalFeatures } from './experimental-features';
import { FakeLocalStorage } from './test-utils/local-storage-double';

describe('experimental features', () => {
  it('should validate if a feature is enabled', () => {
    // Arrange
    const experimentalFeaturesData = {
      feature1: true,
    };
    const storage = new FakeLocalStorage();
    storage.setItem('dopplerExperimental', JSON.stringify(experimentalFeaturesData));
    const experimentalFeatures = new ExperimentalFeatures(storage);
    // Act
    const enabled = !!experimentalFeatures.getFeature('feature1');

    // Assert
    expect(enabled).toBe(true);
  });
  it('should validate when a feature is not enabled', () => {
    // Arrange
    const experimentalFeaturesData = {
      feature1: true,
    };
    const storage = new FakeLocalStorage();
    storage.setItem('dopplerExperimental', JSON.stringify(experimentalFeaturesData));
    const experimentalFeatures = new ExperimentalFeatures(storage);
    // Act
    const enabled = !!experimentalFeatures.getFeature('feature4');

    // Assert
    expect(enabled).toBe(false);
  });
  it('should get a value to use in experimental feature', () => {
    // Arrange
    const experimentalFeaturesData = {
      feature3: {
        apikey: 'myApiKey',
      },
    };
    const storage = new FakeLocalStorage();
    storage.setItem('dopplerExperimental', JSON.stringify(experimentalFeaturesData));
    const experimentalFeatures = new ExperimentalFeatures(storage);
    // Act
    const value = experimentalFeatures.getFeature('feature3').apikey;

    // Assert
    expect(value).toBe('myApiKey');
  });
  it('should return null when feature value does not exist', () => {
    // Arrange
    const experimentalFeaturesData = {
      feature1: {
        apikey: 'myApiKey',
      },
    };
    const storage = new FakeLocalStorage();
    storage.setItem('dopplerExperimental', JSON.stringify(experimentalFeaturesData));
    const experimentalFeatures = new ExperimentalFeatures(storage);
    // Act
    const value = experimentalFeatures.getFeature('feature1').apikey1;

    // Assert
    expect(value).toBe(undefined);
  });
});

describe.each`
  featureValue
  ${null}
  ${0}
  ${false}
  ${''}
`('should return null when feature value is falsy', ({ featureValue }) => {
  test(`(feature value is ${featureValue})`, () => {
    // Arrange
    const experimentalFeaturesData = {
      feature1: featureValue,
    };
    const storage = new FakeLocalStorage();
    storage.setItem('dopplerExperimental', JSON.stringify(experimentalFeaturesData));
    const experimentalFeatures = new ExperimentalFeatures(storage);

    // Act
    const value = experimentalFeatures.getFeature('feature1');

    // Assert
    expect(value).toBeNull;
  });
});
