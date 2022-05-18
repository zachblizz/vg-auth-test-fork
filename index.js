/* eslint-disable no-console, no-path-concat */

// Dependencies
var express = require('express');
var OpenTok = require('opentok-node');
var app = express();

var opentok;
var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var appId = process.env.VONAGE_APP_ID;
var keyPath = process.env.VONAGE_PRIVATE_KEY;
var apiUrl = process.env.VONAGE_VIDEO_API_SERVER_URL;
var otOptions = {
  vgAuth: !!appId,
  apiUrl: apiUrl
};

// Verify that either the OpenTok API key and API secret
// or the VG app ID and private key path are defined
if (!(apiKey && apiSecret) && !(appId && keyPath)) {
  console.log('You must specify API_KEY and API_SECRET or VONAGE_APP_ID and VONAGE_PRIVATE_KEY environment variables');
  process.exit(1);
}

// Starts the express app
function init() {
  app.listen(3000, function () {
    console.log('You\'re app is now ready at http://localhost:3000/');
  });
}

// Initialize the express app
app.use(express.static(__dirname + '/public')); //

// Initialize OpenTok
if (otOptions.vgAuth) {
  opentok = new OpenTok(appId, keyPath, otOptions);
}
else {
  opentok = new OpenTok(apiKey, apiSecret, otOptions);
}

// Create a session and store it in the express app
opentok.createSession({ mediaMode: 'routed' }, function (err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  // We will wait on starting the app until this is done
  init();
});

app.get('/', function (req, res) {
  var sessionId = app.get('sessionId');
  // generate a fresh token for this client
  var token = opentok.generateToken(sessionId);
  opentok = new OpenTok(appId, keyPath, otOptions);
  res.render('index.ejs', {
    apiKey: apiKey,
    appId: appId,
    sessionId: sessionId,
    token: token,
    otjsSrcUrl: process.env.OPENTOK_JS_URL || 'https://static.opentok.com/v2/js/opentok.min.js',
    otjsApiUrl: process.env.OVERRIDE_OPENTOK_JS_API_URL && process.env.VONAGE_VIDEO_API_SERVER_URL
  });
});

app.get('/startArchive/', function (req, res) {
  opentok.startArchive(app.get('sessionId'), function (error, archive) {
    if (error) return res.set(400).send();
    return res.send(archive);
  });
});

app.get('/stopArchive/:id', function (req, res) {
  console.log('stope', req.param('id'))
  opentok.stopArchive(req.param('id'), function (error, archive) {
    if (error) return res.set(400).send();
    return res.send(archive);
  });
});

app.get('/listArchives/', function (req, res) {
  var sessionId = app.get('sessionId');
  opentok.listArchives(sessionId, function (error, archives) {
    console.log('listArchives', error, archives);
    if (error) return res.set(400).send();
    return res.send(archives);
  });
});

app.get('/forceDisconnect/:id', function (req, res) {
  opentok.forceDisconnect(app.get('sessionId'), req.param('id'), function (error) {
    console.log('forceDisconnect', req.param('id'), error);
    if (error) return res.set(400).send();
    return res.send('');
  });
});

app.get('/forceMuteStream/:id', function (req, res) {
  opentok.forceDisconnect(app.get('sessionId'), req.param('id'), function (error) {
    console.log('forceDisconnect', req.param('id'), error);
    if (error) return res.set(400).send();
    return res.send('');
  });
});

app.get('/forceMuteAll/', function (req, res) {
  opentok.forceMuteAll(app.get('sessionId'), function (error) {
    console.log('forceMuteAll', error);
    return res.send('');
  });
});

app.get('/disableForceMute/', function (req, res) {
  opentok.disableForceMute(app.get('sessionId'), function (error) {
    console.log('disableForceMute', error);
    return res.send('');
  });
});

app.get('/signalAll/', function () {
  var sessionId = app.get('sessionId');
  opentok.signal(sessionId, undefined, {
    data: 'hello from server',
    type: 'test-type'
  }, function (error) {
    console.log('signal', error);
  });
});

app.get('/signalConnection/:id', function (req) {
  opentok.signal(app.get('sessionId'), req.param('id'), {
    data: 'hello from server to ' + req.param('id'),
    type: 'test-type'
  }, function (error) {
    console.log('signal', error);
  });
});

app.get('/listStreams/', function (req, res) {
  var sessionId = app.get('sessionId');
  opentok.listStreams(sessionId, function (error, streams) {
    console.log('listStreams', error, streams);
    res.send(streams);
  });
});

app.get('/getStream/:id', function (req, res) {
  opentok.getStream(app.get('sessionId'), req.param('id'), function (error, stream) {
    console.log('getStream', error, stream);
    res.send(stream);
  });
});

app.get('/setStreamClassLists/:id', function (req, res) {
  opentok.setStreamClassLists(app.get('sessionId'), [{
    id: req.param('id'),
    layoutClassList: ['focus']
  }], function (error) {
    console.log('setStreamClassLists', error);
    res.send('');
  });
});
