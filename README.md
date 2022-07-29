# Video API test app

This is a simple app that you can use to test different methods of the OpenTok Node SDK
using an app with VG credentials in either the production or dev environments.

## Running the App

First, download the dependencies:

```
$ npm install
```

## Setup Environments

There is an `env` folder with an [`.env.example`](./env/.env.example) file, which has an example of all the necessary environment variables needed to run the app. Depending on how you want to run your app (in production, or in development), you'll need to create a corresponding `.env.[env_setting]` file (`.env.prod` or `.env.dev`)

Add a Vonage application ID (`appId`) and either a private key string
or a path to a private key file associated with that application (`keyPath`)
to the appropriate `.env` file:

e.g.: an example of the `.env.prod` file:

```
appId=123456
keyPath="-----BEGIN PRIVATE KEY----- ...." # This can be a path to a key file
apiUrl=https://api.dev.opentok.com
otjsSrcUrl=https://static.opentok.com/v2/js/opentok.min.js
```

The `apiUrl` is used for Video API REST calls from the Node server.
To have OpenTok.js in the web app also use the `apiUrl` for API calls
(instead of the API URL loaded from the OpenTok.js config), set `overrideJsUrl` to `true`:

```
overrideJsUrl=true
```

Finally, start the app using node:

```
$ node index.js <env_setting>
```

> for development mode run `node index.js dev` for production mode run `node index.js prod` - by default it'll run in `dev` mode

Or, you can run `npm start` in the root directory of the project.

### To test in the app:

Visit <http://localhost:3000> in your browser. Open the resulting URL again in a second window.
