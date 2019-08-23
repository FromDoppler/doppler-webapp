export class ExperimentalFeatures {
  constructor(storage) {
    this.features = storage.getItem('dopplerExpermiental')
      ? JSON.parse(storage.getItem('dopplerExpermiental'))
      : null;
  }
  getFeature(featureName) {
    return this.features && !!this.features[featureName] ? this.features[featureName] : null;
  }
}
