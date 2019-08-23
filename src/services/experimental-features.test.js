import { ExperimentalFeatures } from './experimental-features';
import { FakeLocalStorage } from './local-storage-double';

describe('experimental features', () => {
  const experimentalFeaturesData = {
    feature1: true,
    feature2: true,
    feature3: {
      apikey: 'myApiKey',
    },
  };
  const storage = new FakeLocalStorage();
  storage.setItem('dopplerExpermiental', JSON.stringify(experimentalFeaturesData));
  const experimentalFeatures = new ExperimentalFeatures(storage);

  it('should validate if a feature is enabled', () => {
    // Arrange
    // Act
    const enabled = !!experimentalFeatures.getFeature('feature1');

    // Assert
    expect(enabled).toBe(true);
  });
  it('should validate when a feature is not enabled', () => {
    // Arrange
    // Act
    const enabled = !!experimentalFeatures.getFeature('feature4');

    // Assert
    expect(enabled).toBe(false);
  });
  it('should get a value to use in experimental feature', () => {
    // Arrange
    // Act
    const value = experimentalFeatures.getFeature('feature3').apikey;

    // Assert
    expect(value).toBe('myApiKey');
  });
  it('should return null when feature value does not exist', () => {
    // Arrange
    // Act
    const value = experimentalFeatures.getFeature('feature1').apikey1;

    // Assert
    expect(value).toBe(undefined);
  });
});
