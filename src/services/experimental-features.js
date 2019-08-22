export class ExperimentalFeatures {
  constructor(storage) {
    this.storage = storage;
    this.features = this.storage.getItem('dopplerExpermiental')
      ? JSON.parse(this.storage.getItem('dopplerExpermiental'))
      : null;
  }
  getExperimentalFeatures() {
    return this.features;
  }
  isFeatureEnabled(feature) {
    const experimentalFeatures = this.getExperimentalFeatures();
    return experimentalFeatures && !!experimentalFeatures[feature];
  }
  getFeatureValue(feature, param) {
    const experimentalFeatures = this.getExperimentalFeatures();
    return experimentalFeatures &&
      !!experimentalFeatures[feature] &&
      experimentalFeatures[feature][param]
      ? experimentalFeatures[feature][param]
      : null;
  }
}
