# Doppler new webapp with reactjs

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Testing in each PR

Each time a PR is made CI is run, to see a full detail check [DockerFile](https://github.com/FromDoppler/doppler-webapp/blob/master/Dockerfile.BUILDS_AND_CDN).

As a result a temporal version of the code is published into CDN marked with a build number.

To check the build number in the second check marked in each PR, while hovering in details the version is as marked in the image below.

![PR view](PR-build-number.png "View build version in detail link")

Then a build code link with build number 2962 can be formatted as follows for all enviroments:

- **Production:** <https://cdn.fromdoppler.com/doppler-webapp/build2962/#/login>

- **Integration:** <https://cdn.fromdoppler.com/doppler-webapp/int-build2962/#/login>

- **QA:** <https://cdn.fromdoppler.com/doppler-webapp/qa-build2962/#/login>

- **Demo:** <https://cdn.fromdoppler.com/doppler-webapp/demo-build2962/#/login>
Demo is like a local copy hosted into CDN (it uses doubles and no real data).

- **Development:** <https://cdn.fromdoppler.com/doppler-webapp/demo-build2962/#/login>
Development is code that points to local Doppler (It is needed to have local Doppler copy running for this to work).

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
