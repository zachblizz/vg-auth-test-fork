/* eslint-disable no-console, no-path-concat */

// Dependencies
var express = require('express');
var OpenTok = require('opentok-node');
var app = express();

var apiKey = process.env.API_KEY;
var apiSecret = process.env.API_SECRET;
var appId = process.env.VONAGE_APP_ID;
var otjsSrcUrl = process.env.DEV_OPENTOK_JS_URL || 'https://static.opentok.com/v2/js/opentok.min.js';
var keyPath = process.env.VONAGE_PRIVATE_KEY;
var apiUrl = process.env.VONAGE_VIDEO_API_SERVER_URL2342// || 'https://api.opentok.com';
var devAppId = process.env.DEV_VONAGE_APP_ID;
var devKey = process.env.DEV_VONAGE_PRIVATE_KEY;
var devApiServerUrl = process.env.DEV_VONAGE_VIDEO_API_SERVER_URL234 || 'https://api-us.dev.v1.vonagenetworks.net/video';
var devOtjsSrcUrl = process.env.DEV_OPENTOK_JS_URL || 'https://static.dev.tokbox.com/v2/js/opentok.js';

var otOptions = {
  vgAuth: !!appId,
  apiUrl: apiUrl
};
var port = process.env.PORT || 3000;

// Verify that the VG app ID and private key path are defined
if (!(appId && keyPath && devAppId && devKey)) {
  console.log('Missing environment variables');
  process.exit(1);
}

app.use(express.static(__dirname + '/public')); //

app.listen(port, function () {
  console.log('You\'re app is now ready at http://localhost:' + port);
});

function getOpentok(req) {
  if ((req.query && req.query.env) === 'dev') {
    console.log(req.originalUrl, devApiServerUrl);
    return new OpenTok(devAppId, devKey, {
      vgAuth: !!devAppId,
      apiUrl: devApiServerUrl
    });
  }
  return new OpenTok(appId, keyPath, {
    vgAuth: !!appId,
    apiUrl: apiUrl
  });
}

function getOpenjsUrl(req) {
  if ((req.query && req.query.env) === 'dev') {
    return devOtjsSrcUrl;
  }
  return otjsSrcUrl
}

app.get('/', function (req, res) {
  ot = getOpentok(req);
  ot.createSession({ mediaMode: 'routed' }, function (err, session) {
    if (err) {
      console.log(err);
      return res.set(400).send(err.message);
    }
    var query = (req.query && req.query.env) ? '?env=' + req.query.env : '';
    res.redirect('/' + session.sessionId + query);
  });
});

app.get('/:sessionId', function (req, res) {
  console.log(44, process.env.OVERRIDE_OPENTOK_JS_API_URL)
  var sessionId = req.params.sessionId;
  ot = getOpentok(req);
  var token = ot.generateToken(sessionId);
  res.render('index.ejs', {
    apiKey: apiKey,
    appId: appId,
    sessionId: sessionId,
    token: token,
    otjsSrcUrl: getOpenjsUrl(req),
    otjsApiUrl: 'https://api-us.dev.v1.vonagenetworks.net/video'
  });
});

app.get('/startArchive/:sessionId', function (req, res) {
  ot = getOpentok(req);
  ot.startArchive(req.params.sessionId, function (error, archive) {
    console.log(3333, error, archive)
    if (error) return res.set(400).send();
    return res.send(archive);
  });
});

app.get('/stopArchive/:id', function (req, res) {
  ot = getOpentok(req);
  console.log('stopArchive', req.params.id)
  ot.stopArchive(req.params.id, function (error, archive) {
    if (error) return res.set(400).send();
    return res.send(archive);
  });
});

app.get('/listArchives/:sessionId', function (req, res) {
  ot = getOpentok(req);
  ot.listArchives(req.params.sessionId, function (error, archives) {
    console.log('listArchives', error, archives);
    if (error) return res.set(400).send();
    return res.send(archives);
  });
});

app.get('/forceDisconnect/:sessionId/:connectionId', function (req, res) {
  ot = getOpentok(req);
  ot.forceDisconnect(req.params.sessionId, req.params.connectionId, function (error) {
    console.log('forceDisconnect', req.params.id, error);
    if (error) return res.set(400).send();
    return res.send('');
  });
});

app.get('/forceMuteStream/:sessionId/:streamId', function (req, res) {
  ot = getOpentok(req);
  ot.forceDisconnect(req.params.sessionId, req.params.streamId, function (error) {
    console.log('forceDisconnect', req.params.streamId, error);
    if (error) return res.set(400).send();
    return res.send('');
  });
});

app.get('/forceMuteAll/:sessionId', function (req, res) {
  ot = getOpentok(req);
  ot.forceMuteAll(req.params.sessionId, function (error) {
    console.log('forceMuteAll', error);
    return res.send('');
  });
});

app.get('/disableForceMute/:sessionId', function (req, res) {
  ot = getOpentok(req);
  ot.disableForceMute(req.params.sessionId, function (error) {
    console.log('disableForceMute', error);
    return res.send('');
  });
});

app.get('/signalAll/:sessionId', function (req) {
  ot = getOpentok(req);
  ot.signal(req.params.sessionId, undefined, {
    data: 'hello from server',
    type: 'test-type'
  }, function (error) {
    console.log('signal', error);
  });
});

app.get('/signalConnection/:sessionId/:connectionId', function (req, res) {
  ot = getOpentok(req);
  ot.signal(req.params.sessionId, req.params.connectionId, {
    data: 'hello from server to ' + req.params.connectionId,
    type: 'test-type'
  }, function (error) {
    console.log('signal', error);
  });
});

app.get('/listStreams/:sessionId', function (req, res) {
  ot = getOpentok(req);
  ot.listStreams(req.params.sessionId, function (error, streams) {
    console.log('listStreams', error, streams);
    res.send(streams);
  });
});

app.get('/getStream/:sessionId/:id', function (req, res) {
  ot = getOpentok(req);
  var sessionId = req.params.sessionId;
  ot.getStream(sessionId, req.params.id, function (error, stream) {
    console.log('getStream', error, stream);
    res.send(stream);
  });
});

app.get('/setStreamClassLists/:sessionId/:id', function (req, res) {
  ot = getOpentok(req);
  var sessionId = req.params.sessionId;
  ot.setStreamClassLists(sessionId, [{
    id: req.params.id,
    layoutClassList: ['focus']
  }], function (error) {
    console.log('setStreamClassLists', error);
    res.send('');
  });
});
