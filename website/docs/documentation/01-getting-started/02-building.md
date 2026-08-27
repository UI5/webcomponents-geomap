# Building the Project Locally

## Prerequisites

You need to install either [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for dependency management.

## Preparation

Use `npm` (or `yarn`) to install the dependencies:

```sh
npm install
```

(To use yarn, just replace 'npm' with `yarn`.)

## Run the Library

Execute the following command to run the library locally for development in watch mode (the browser reloads the app automatically when there are changes in the source code):

```sh
npm start
```

As shown in the terminal after executing this command, the app runs on http://localhost:8080/. A browser window with the URL pointing to your controls' test page opens automatically.

(When using yarn, replace `npm start` with `yarn start`.)

## Build the Library

### Unoptimized (but quick)

Execute the following command to build the project and get an app that can be deployed:

```sh
npm run build
```

The result is placed into the `dist` folder. To start the generated package, just run

```sh
npm run start:dist
```

Note that the HTML page still loads the UI5 framework from the relative URL `resources/...` which does not physically exist but is only provided dynamically by the UI5 tooling. For an actual deployment you should change this URL to either [the CDN](https://sdk.openui5.org/#/topic/2d3eb2f322ea4a82983c1c62a33ec4ae) or your local deployment of UI5.

(When using yarn, use `yarn build` and `yarn start:dist` instead.)

Navigate to: `http://localhost:8088/test-resources/pages/index.html`

## Check the Code

To lint the code use:

```sh
npm run lint
```

(Again, when using yarn, use `yarn lint` instead.)

