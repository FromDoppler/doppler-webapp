const disableHusky = process.env.DISABLE_HUSKY !== undefined;
if (!disableHusky) {
  const husky = require('husky');
  husky.install();
  husky.set('.husky/pre-commit', 'yarn lint-staged');
  husky.set('.husky/commit-msg', 'yarn commitlint --edit $1');
}
