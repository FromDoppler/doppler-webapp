# Doppler new webapp with reactjs

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Guide Lines

### Test

- It's recommended to test from the user's point of view, hiding implementation details. [More details](https://testing-library.com/docs/).

- Recommended documentation for [test implementation](https://github.com/FromDoppler/doppler-webapp/pull/1504).

- Test phases:

  - **Arrange:** a series of input data is created to be able to run the tests.

  - **Act:** tests are run with the input data.

  - **Assert**: the result obtained is analyzed to see if it matches what is expected.

- Pre-commit hook is used in local development (husky+link-staged). [More details](https://github.com/FromDoppler/doppler-webapp/pull/1523).

- There's no QA team, so each development must be tested. Also, if a new development is not tested, coverage decreases. If the coverage is below the accepted limit, the merge will not be possible. [More details](https://github.com/FromDoppler/doppler-webapp/pull/1593).

### Code organization

- **Components:** This is located in the _src/components_ path. Each should be located in a separate folders and must contain:

  - component implementation

  - tests

  - styles

  - images

  Also, the component is organized internally in the following order:

  - hooks are located at the top

  - constants and states together

  - functions.

  **Outside the component** the variables or functions that do not depend on some props. [See slack conversation thread for more details](https://makingsense.slack.com/archives/CGJ72QFQX/p1625754680182000).

- **Hooks:** This located in _src/hooks_ path. Each should be located in a separate folders and must contain:

  - hook implementation

  - tests

- **Services:** This is located in the _src/services_ path. Each should be located in a separate folder and must contain:

  - service implementation

  - tests

  - service double

- **Translations:** This is located in _src/i18n_ path. There are two files: _en.js_ and _es.js_. If the translation is common, it's added within the _common_ property, otherwise, it's added in the property that contains the translations of the corresponding module.

- **Gif/Images:** The reused gif/images are located in the _src/img_ path. The particular images are located in the folder of the component that uses them. Example: a gif for the contact policy promotional page.

### Procure to use declarative style instead of the imperative style

- Use _const_ instead of _let_ and _var_. Example:

  ```
  // Not recommended
  let result;
  if(someCondition) {
    result = calculationA();
  } else {
    result = calculationB();
  }

  // Better
  const result = someCondition ? calculationA() : calculationB();
  ```

  [Reference documentation](https://jrsinclair.com/articles/2021/rethinking-the-javascript-ternary-operator/).

- Use High Order Functions when it’s possible. Examples:

  ```
  // Not recommended
  for(let i=0; i < cities.length; i++) {
    const city = cities[i];
    // to do something with city
  }

  // Better
  cities.forEach((city) => {
    // to do something with city
  });
  ```

  ```
  // Not recommended
  for(let i=0; i < myArray.length; i++) {
    myArray.key = “a value”;
    myArray.otherKey = “a value”;
  }

  // Better
  const newArray = myArray.map((item) => ({
    ...item,
    key: “a value”,
    otherKey: “a value”,
  }));
  ```

### Others

- Use composition instead of inheritance to reuse code between components. [More details](https://reactjs.org/docs/composition-vs-inheritance.html).

- Use _named imports_ instead of _default imports_. [More details](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/).

- Use pronounceable and expressive names for variables, always prioritizing the _camelcase style_. Avoid using names that refer to the data type.

- Use the _useTimeout_ hook on components instead of _setTimeout_. [More details](https://github.com/FromDoppler/doppler-webapp/pull/1428).

- Use a maximum number of 2 parameters for functions. If the number is exceeded, use an object.

- Use the [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) operator. Example:

  ```
  // Not recommended
  if(obj.first && obj.first.second) {
    // ...to do something
  }

  // Better
  if(obj?.first?.second) {
    // ...to do something
  }
  ```

## Cointinuous Deployment and commit format

We use [semantic release](https://github.com/semantic-release/semantic-release) to generate each tag for automatic versioning, that's why it's important to have each commit formatted correctly, this tool uses [Angular commit message](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) format by default that uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

The format is the following:

`<type>(<scope>): <short summary>`

The types we most use are:

- docs: Documentation only changes
- feat: A new feature (this triggers a new tag and deploys inmediately)
- fix: A bug fix (this triggers a new tag and deploys inmediately)
- chore: a task (this does not generate a new version tag)
- test: Adding missing tests or correcting existing tests

Some examples:

**fix(login):** fix a typo in main title

**feat(reports):** add new GDPR report

**chore:** update component version

## Testing in each PR and CI

⚠️ With every merge, the code is deployed into production, whenever we have a fix or feat commit, that's why we test in each PR before merge.

Each time a PR is made CI is run, to see a full detail check [DockerFile](https://github.com/FromDoppler/doppler-webapp/blob/master/Dockerfile.BUILDS_AND_CDN).

What is run in CI?

- prettier
- eclint
- tests
- temporal version generation

As a result of running CI, a temporal version of the code is published into CDN marked with a build number.

To check the build number in the second check marked in each PR, while hovering in details the version is as marked in the image below.

![PR view](PR-build-number.PNG 'View build version in detail link')

Then a build code link with build number 2962 can be formatted as follows for all enviroments:

- **Production:** <https://cdn.fromdoppler.com/doppler-webapp/build2962/#/login>

- **Integration:** <https://cdn.fromdoppler.com/doppler-webapp/int-build2962/#/login>

- **QA:** <https://cdn.fromdoppler.com/doppler-webapp/qa-build2962/#/login>

- **Demo:** <https://cdn.fromdoppler.com/doppler-webapp/demo-build2962/#/login>
  Demo is like a local copy hosted into CDN (it uses doubles and no real data).

- **Development:** <https://cdn.fromdoppler.com/doppler-webapp/demo-build2962/#/login>
  Development is code that points to local Doppler (It is needed to have local Doppler copy running for this to work).

## Small PRs

In this project we have include [PR size](https://github.com/marketplace/pull-request-size), as a way to measure how much is small. Right now we tend to make size M or L PRs and that's our size for small.

We try to use vertical slicing or partial functionalities to keep our PRs small enough to be easily understood.

## About partial functionalities

To make our PRs small sometimes is useful to upload hidden functionality. This can be done by using the dopplerExperimental component.

```javascript
const PermissionExpandableRow = ({ dependencies: { experimentalFeatures } }) => {
  ...

  const isPermissionHistoryEnabled =
    experimentalFeatures && experimentalFeatures.getFeature('PermissionHistory');
  ...

  return (
    <>
      <tr>
        <td>
          <span className="dp-name-text">
            {isPermissionHistoryEnabled && (
              <button>
  ...
```

To make use of this feature by console it can be enabled like this:
`localStorage.setItem('dopplerExperimental', JSON.stringify({PermissionHistory: true}));`

## Available Scripts

### Install

In the project directory, you can run:

`yarn install`

In the project directory, you can run:

### `yarn start or yarn`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
