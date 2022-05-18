# Video API test app

This is a simple app that you can use to test different methods of the OpenTok Node SDK
using an app with VG credentials.


## Running the App

First, download the dependencies using [npm](https://www.npmjs.org) in the root directory of the
opentok-node project:

```
$ npm install
```

(This sample app is included in the npm workspaces declared in the package.json file for
the root project.)

Add a Vonage application ID (`VONAGE_APP_ID`) and either a private key string
or a path to a private key file associated with that application (`VONAGE_PRIVATE_KEY`)
to the environment variables:

```
export VONAGE_APP_ID=123456
export VONAGE_PRIVATE_KEY="/Users/bob/Downloads/bobs-private-key.key"
export VONAGE_VIDEO_API_SERVER_URL=https://api.dev.opentok.com
export OPENTOK_JS_URL=https://static.dev.tokbox.com/v2/js/opentok.js
```

If you set the Vonage application credentials, the app will use these instead of 
an OpenTok API key and secret.

Also, to use a test environment, set the `VONAGE_VIDEO_API_SERVER_URL` and `OPENTOK_JS_URL`
environment variables:

```
export VONAGE_VIDEO_API_SERVER_URL=https://api.dev.opentok.com
export OPENTOK_JS_URL=https://static.dev.tokbox.com/v2/js/opentok.js
```

The `VONAGE_VIDEO_API_SERVER_URL` is used for Video API REST calls from the Node server.
To have OpenTok.js in the web app also use the `VONAGE_VIDEO_API_SERVER_URL` for API calls
(instead of the API URL loaded from the OpenTok.js config), set `OVERRIDE_OPENTOK_JS_API_URL`
to `true`):

```
export OVERRIDE_OPENTOK_JS_API_URL=true
```

Finally, start the app using node:

```
$ node index.js
```

Or, you can run `npm start` in the root directory of the opentok-node project.

Visit <http://localhost:3000> in your browser. Open it again in a second window. Smile! You've just
set up a group chat.

## Walkthrough

This application extends the HelloWorld sample app. It adds some UI controls that cause the
client app to make requests to an endpoint that result in methods in the server SDK being called.
