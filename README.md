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
<<<<<<< HEAD
appId=123456
keyPath="-----BEGIN PRIVATE KEY----- ...." # This can be a path to a key file
apiUrl=https://api.dev.opentok.com
otjsSrcUrl=https://static.opentok.com/v2/js/opentok.min.js
=======
export VONAGE_APP_ID=123456
export VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY----- ...." # This can be a path to a key file
```

The following defaults are already set (but you can override them):

```export VONAGE_VIDEO_API_SERVER_URL=https://video.api.vonage.com
export OPENTOK_JS_URL=https://static.opentok.com/v2/js/opentok.min.js
>>>>>>> 975d1f3f855aaeedc394ca960cbcf9baad5774d7
```

The `apiUrl` is used for Video API REST calls from the Node server.
To have OpenTok.js in the web app also use the `apiUrl` for API calls
(instead of the API URL loaded from the OpenTok.js config), set `overrideJsUrl` to `true`:

```
<<<<<<< HEAD
overrideJsUrl=true
=======
export DEV_VONAGE_APP_ID=123456
export DEV_VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY----- ...." # This can be a path to a key file
```

The following defaults are already set for the dev environment (but you can override them):

```
export DEV_VONAGE_VIDEO_API_SERVER_URL=https://video.api.dev.vonage.com
export DEV_OPENTOK_JS_URL=https://static.dev.tokbox.com/v2/js/opentok.js
```

The `VONAGE_VIDEO_API_SERVER_URL` is used for Video API REST calls from the Node server.
To have OpenTok.js in the web app also use the `VONAGE_VIDEO_API_SERVER_URL` for API calls
(instead of the API URL loaded from the OpenTok.js config), set `OVERRIDE_OPENTOK_JS_API_URL` 
(for production) and/or `DEV_OVERRIDE_OPENTOK_JS_API_URL` to `true`:

```
export OVERRIDE_OPENTOK_JS_API_URL=true
export DEV_OVERRIDE_OPENTOK_JS_API_URL=true
>>>>>>> 975d1f3f855aaeedc394ca960cbcf9baad5774d7
```

Finally, start the app using node:

```
$ node index.js <env_setting>
```

> for development mode run `node index.js dev` for production mode run `node index.js prod` - by default it'll run in `dev` mode

Or, you can run `npm start` in the root directory of the project.

### To test in the app:

Visit <http://localhost:3000> in your browser. Open the resulting URL again in a second window.
<<<<<<< HEAD
=======

### To test in the dev environment:

Visit <http://localhost:3000?env=dev> (note the query string) in your browser.
Open the resulting URL again in a second window.

### Other session options:

You can create a relayed session by including `relayed=true` in the query string:

* In production: <http://localhost:3000?relayed=true>

* In dev: <http://localhost:3000?env=dev&relayed=true>


You can create an audio-only session by including `audioOnly=true` in the query string:

* In production: <http://localhost:3000?audioOnly=true>

* In dev: <http://localhost:3000?env=dev&audioOnly=true>

You can create session that is both audio-only and relayed by including both `audioOnly=true` and
`relayed=true` in the query string:

* In production: <http://localhost:3000?audioOnly=true&relayed=true>

* In dev: <http://localhost:3000?env=dev&audioOnly=true&relayed=true>
>>>>>>> 975d1f3f855aaeedc394ca960cbcf9baad5774d7
