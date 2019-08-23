export class ExperimentalFeatures {
  constructor(storage) {
    this.storage = storage;
    this.features = this.storage.getItem('dopplerExpermiental')
      ? JSON.parse(this.storage.getItem('dopplerExpermiental'))
      : null;
  }
  isFeatureEnabled(feature) {
    return this.features && !!this.features[feature];
  }
  getFeatureValue(feature, param) {
    return this.features && !!this.features[feature] && this.features[feature][param]
      ? this.features[feature][param]
      : null;
  }
}
