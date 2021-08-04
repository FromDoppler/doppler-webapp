const disableHusky = process.env.DISABLE_HUSKY !== undefined;
if (!disableHusky) {
  const husky = require('husky');
  husky.install();
  husky.set('.husky/pre-commit', 'yarn lint-staged');
}