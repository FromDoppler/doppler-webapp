export class ExperimentalFeatures {
  constructor(storage) {
    this.features = storage.getItem('dopplerExperimental')
      ? JSON.parse(storage.getItem('dopplerExperimental'))
      : null;
  }
  getFeature(featureName) {
    return (this.features && this.features[featureName]) || null;
  }
}
