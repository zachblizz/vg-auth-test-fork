/* eslint-disable no-console, no-path-concat */

// Dependencies
const env = require('dotenv');
const express = require('express');
const Vonage = require('@vonage/video');
const app = express();
const path = require('path');
const fs = require('fs');

var vonageVideo;

const setting = process.argv[2];
console.log(`using env ${setting}`);
const { appId, keyPath, apiUrl, otjsSrcUrl, overrideJsUrl, PORT } = env.config({
  path: path.resolve(__dirname, 'env', `.env.${setting}`),
}).parsed;
console.log({ appId, keyPath, apiUrl, otjsSrcUrl, overrideJsUrl });

var port = PORT || 8008;

if (!(appId && keyPath)) {
  console.log('Missing environment variables');
  process.exit(1);
}

// Verify that the VG app ID and private key path are defined

app.use(express.static(__dirname + '/public')); //

app.listen(port, function () {
  console.log("You're app is now ready at http://localhost:" + port);
});

function getVonageVideo() {
  return new Vonage.Video({
    applicationId: appId,
    privateKey: keyPath.indexOf('-----BEGIN PRIVATE KEY-----') > -1 ? keyPath : fs.readFileSync(keyPath),
    baseUrl: apiUrl,
  });
}

function getOpenjsUrl() {
  return otjsSrcUrl;
}

function getOpenTokjsApisUrl() {
  return overrideJsUrl && apiUrl;
}

function loadEnvironment(setting = 'prod') {
  console.log(`using env '${setting}'`);
  if (currentEnv !== setting) {
    currentEnv = setting;
  }
}

app.get('/', async function (req, res) {
  vonageVideo = getVonageVideo(req);

  try {
    var session = await vonageVideo.createSession({
      mediaMode: 'routed',
    });
    console.log('new session:', session);
    var query = req.query && req.query.env ? '?env=' + req.query.env : '';
    return res.redirect('/' + session[0].session_id + query);
  } catch (err) {
    return res.set(400).send(err.message);
  }
});

app.get('/:sessionId', function (req, res) {
  var sessionId = req.params.sessionId;
  vonageVideo = getVonageVideo(req);
  var token = vonageVideo.generateClientToken(sessionId);
  res.render('index.ejs', {
    appId: appId,
    sessionId: sessionId,
    token: token,
    otjsSrcUrl: getOpenjsUrl(req),
    otjsApiUrl: getOpenTokjsApisUrl(req),
  });
});

app.get('/startArchive/:sessionId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    var archive = await vonageVideo.startArchive(req.params.sessionId);
    return res.send(archive);
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/stopArchive/:id', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    var archive = await vonageVideo.stopArchive(req.params.id);
    return res.send(archive);
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/listArchives/:sessionId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    var archives = await vonageVideo.searchArchives({
      sessionId: req.params.sessionId,
    });
    return res.send(archives);
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/forceDisconnect/:sessionId/:connectionId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    await vonageVideo.disconnectClient(req.params.sessionId, req.params.connectionId);
    return res.send('');
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/forceMuteStream/:sessionId/:streamId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    await vonageVideo.muteStream(req.params.sessionId, req.params.streamId);
    return res.send('');
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/forceMuteAll/:sessionId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    await vonageVideo.muteAllStreams(req.params.sessionId, true);
    return res.send('');
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/disableForceMute/:sessionId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    await vonageVideo.muteAllStreams(req.params.sessionId, false);
    return res.send('');
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/signalAll/:sessionId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    await vonageVideo.sendSignal(
      {
        data: 'hello from server',
        type: 'test-type',
      },
      req.params.sessionId
    );
    return res.send('');
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/signalConnection/:sessionId/:connectionId', async function (req, res) {
  vonageVideo = getVonageVideo(req, res);
  try {
    await vonageVideo.sendSignal(
      {
        data: 'hello from server to ' + req.params.connectionId,
        type: 'test-type',
      },
      req.params.sessionId,
      req.params.connectionId
    );
    return res.send('');
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/listStreams/:sessionId', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    var streams = await vonageVideo.getStreamInfo(req.params.sessionId);
    return res.send(streams);
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/getStream/:sessionId/:id', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    var stream = await vonageVideo.getStreamInfo(req.params.sessionId, req.params.id);
    return res.send(stream);
  } catch (error) {
    return res.set(400).send();
  }
});

app.get('/setStreamClassLists/:sessionId/:id', async function (req, res) {
  vonageVideo = getVonageVideo(req);
  try {
    var stream = await vonageVideo.setStreamClassLists(req.params.sessionId, [
      {
        id: req.params.id,
        layoutClassList: ['focus'],
      },
    ]);
    return res.send(stream);
  } catch (error) {
    return res.set(400).send();
  }
});
