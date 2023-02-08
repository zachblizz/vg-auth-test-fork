/* eslint-disable no-console, no-path-concat */

// Dependencies
const env = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const Vonage = require('@vonage/video');
const app = express();
const path = require('path');
const fs = require('fs');

let vonageVideo;

const setting = process.argv[2];
console.log(`using env ${setting}`);
const { appId, keyPath, apiUrl, otjsSrcUrl, overrideJsUrl } = env.config({
  path: path.resolve(__dirname, 'env', `.env.${setting}`),
}).parsed;
const { PORT } = env.config({ path: path.resolve(__dirname, 'env', '.env') });
console.log({ appId, keyPath, apiUrl, otjsSrcUrl, overrideJsUrl });

const port = PORT || 8008;

if (!(appId && keyPath)) {
  console.log('Missing environment variables');
  process.exit(1);
}

// Verify that the VG app ID and private key path are defined

app.use(express.static(path.resolve(__dirname, 'public'))); //
app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`You're app is now ready at http://localhost: ${port}`);
});

function getVonageVideo() {
  return new Vonage.Video(
    {
      applicationId: appId,
      privateKey: fs.readFileSync(keyPath),
    },
    {
      videoHost: apiUrl,
    }
  );
}

function getOpenjsUrl() {
  return otjsSrcUrl;
}

function getOpenTokjsApisUrl() {
  return overrideJsUrl && apiUrl;
}

app.get('/', async (req, res) => {
  vonageVideo = getVonageVideo();

  // The @vonage/video SDK uses enum values of 'enabled' : 'disabled' for the mediaMode option.
  // See https://github.com/Vonage/vonage-node-sdk/blob/3.x/packages/video/lib/interfaces/MediaMode.ts
  const mediaMode = req.query.relayed === 'true' ? 'enabled' : 'disabled';
  const queryArray = [];
  Object.keys(req.query).forEach(key => queryArray.push(`${key}=${req.query[key]}`));
  const qString = queryArray.length > 0 ? `?${queryArray.join('&')}` : '';
  try {
    const session = await vonageVideo.createSession({ mediaMode });
    return res.redirect(`/${session.sessionId}${qString}`);
  } catch (err) {
    console.log('here', err);
    return res.status(400).send(`Error. ${err.response?.data?.detail}`);
  }
});

app.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const token = vonageVideo.generateClientToken(sessionId);
  res.render('index.ejs', {
    appId,
    sessionId,
    token,
    otjsSrcUrl: getOpenjsUrl(req),
    otjsApiUrl: getOpenTokjsApisUrl(req),
  });
});

app.post('/startArchive/:sessionId', async (req, res) => {
  if (!req.body) {
    return res.status(500).json({ errorMessage: 'no request body sent with startArchive' });
  }

  const archiveOptions = { ...req.body };

  try {
    const archive = await vonageVideo.startArchive(req.params.sessionId, archiveOptions);
    return res.send(archive);
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/stopArchive/:id', async (req, res) => {
  try {
    const archive = await vonageVideo.stopArchive(req.params.id);
    return res.send(archive);
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/deleteArchive/:id', async (req, res) => {
  try {
    await vonageVideo.deleteArchive(req.params.id);
    return res.send();
  } catch (error) {
    return res.status(400).send(error.response.data.message);
  }
});

app.post('/startBroadcast/:sessionId', async (req, res) => {
  try {
    const broadcast = await vonageVideo.startBroadcast(req.params.sessionId, req.body);
    return res.send(broadcast);
  } catch (error) {
    return res.set(400).send(error.response.data);
  }
});

app.get('/stopBroadcast/:id', async (req, res) => {
  try {
    const broadcast = await vonageVideo.stopBroadcast(req.params.id);
    return res.send(broadcast);
  } catch (error) {
    return res.set(400).send(error.response.data);
  }
});

app.get('/listArchives/:sessionId', async (req, res) => {
  try {
    const archives = await vonageVideo.searchArchives({
      sessionId: req.params.sessionId,
    });
    return res.send(archives);
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/listBroadcasts/:sessionId', async (req, res) => {
  try {
    const broadcasts = await vonageVideo.searchBroadcasts({
      sessionId: req.params.sessionId,
    });
    return res.send(broadcasts);
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/forceDisconnect/:sessionId/:connectionId', async (req, res) => {
  try {
    await vonageVideo.disconnectClient(req.params.sessionId, req.params.connectionId);
    return res.send('');
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/forceMuteStream/:sessionId/:streamId', async (req, res) => {
  try {
    await vonageVideo.muteStream(req.params.sessionId, req.params.streamId);
    return res.send('');
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/forceMuteAll/:sessionId', async (req, res) => {
  try {
    await vonageVideo.muteAllStreams(req.params.sessionId, true);
    return res.send('');
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/disableForceMute/:sessionId', async (req, res) => {
  try {
    await vonageVideo.muteAllStreams(req.params.sessionId, false);
    return res.send('');
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/signalAll/:sessionId', async (req, res) => {
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
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/signalConnection/:sessionId/:connectionId', async (req, res) => {
  try {
    await vonageVideo.sendSignal(
      {
        data: `hello from server to ${req.params.connectionId}`,
        type: 'test-type',
      },
      req.params.sessionId,
      req.params.connectionId
    );
    return res.send('');
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/listStreams/:sessionId', async (req, res) => {
  vonageVideo = getVonageVideo(req);
  try {
    const streams = await vonageVideo.getStreamInfo(req.params.sessionId);
    return res.send(streams);
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/getStream/:sessionId/:id', async (req, res) => {
  vonageVideo = getVonageVideo(req);
  try {
    const stream = await vonageVideo.getStreamInfo(req.params.sessionId, req.params.id);
    return res.send(stream);
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});

app.get('/setStreamClassLists/:sessionId/:id', async (req, res) => {
  vonageVideo = getVonageVideo(req);
  try {
    const stream = await vonageVideo.setStreamClassLists(req.params.sessionId, [
      {
        id: req.params.id,
        layoutClassList: ['focus'],
      },
    ]);
    return res.send(stream);
  } catch (error) {
    return res.status(400).json({ errorMessage: error.response.data.message });
  }
});
