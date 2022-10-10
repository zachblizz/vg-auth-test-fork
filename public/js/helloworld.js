/* global OT, appId, sessionId, token */

const session = OT.initSession(appId, sessionId);

const publisher = OT.initPublisher('publisher');
let streamId;
let archiveId;
let logPre;
let logDiv;

const log = function (str) {
  const logStr = `${new Date().toISOString()}: ${str}\n`;
  console.log(logStr);
  logPre.innerText += logStr;
  logDiv.scrollTop = logDiv.scrollHeight;
};

session.on({
  sessionConnected() {
    log(`connected to session ${sessionId}`);
    session.publish(publisher);
  },

  streamCreated(event) {
    log(`new subscriber stream ${event.stream.id}`);
    session.subscribe(event.stream, 'streams-container', { insertMode: 'append' });
  },
  streamDestroyed(event) {
    log(`subscriber stream e${event.stream.id}`);
    session.subscribe(event.stream, 'streams-container', { insertMode: 'append' });
  },
  signal(e) {
    log(`signal data:${e.data} -- type: ${e.type}`);
  },

  archiveStarted(e) {
    log(`archiveStarted ${e.id}`);
    archiveId = e.id;
  },

  archiveStopped(e) {
    log(`archiveStopped ${e.id}`);
  },

  sessionDisconnected() {
    log('sessionDisconnected');
  },
});

publisher.on('streamCreated', (event) => {
  log(`new published stream ${event.stream.id}`);
  streamId = event.stream.id;
});

window.addEventListener('DOMContentLoaded', () => {
  logPre = document.getElementById('log-pre');
  logDiv = document.getElementById('log-div');
  document.getElementById('start-archive-btn').addEventListener('click', () => {
    log('startArchive');
    fetch(`/startArchive/${sessionId}${location.search}`, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        archiveId = data.id;
        log(JSON.stringify(data, null, 2));
      });
  });

  document.getElementById('stop-archive-btn').addEventListener('click', () => {
    log(`stopArchive ${archiveId}`);
    fetch(`/stopArchive/${archiveId}${location.search}`, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => {
        archiveId = data.id;
        log(JSON.stringify(data, null, 2));
      });
  });

  document.getElementById('force-disconnect-btn').addEventListener('click', () => {
    fetch(`/forceDisconnect/${sessionId}/${session.connection.id}${location.search}`, {
      method: 'get',
    }).then(() => { log('forced to disconnect'); });
  });

  document.getElementById('force-mute-all-btn').addEventListener('click', () => {
    fetch(`/forceMuteAll/${sessionId}${location.search}`, {
      method: 'get',
    }).then(() => { log('session muted'); });
  });

  document.getElementById('force-mute-stream-btn').addEventListener('click', () => {
    fetch(`/forceMuteStream/${sessionId}/${streamId}${location.search}`, {
      method: 'get',
    }).then(() => { log('stream muted'); });
  });

  document.getElementById('disable-force-mute-btn').addEventListener('click', () => {
    fetch(`/disableForceMute/${sessionId}${location.search}`, {
      method: 'get',
    }).then(() => { log('force mute disabled'); });
  });

  document.getElementById('signal-me-btn').addEventListener('click', () => {
    fetch(`/signalConnection/${sessionId}/${session.connection.id}${location.search}`, {
      method: 'get',
    });
  });

  document.getElementById('signal-all-btn').addEventListener('click', () => {
    console.log(`${23342}/signalAll/${sessionId}`);
    fetch(`/signalAll/${sessionId}${location.search}`, {
      method: 'get',
    });
  });

  document.getElementById('list-streams-btn').addEventListener('click', () => {
    fetch(`/listStreams/${sessionId}${location.search}`, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => { log(JSON.stringify(data, null, 2)); });
  });

  document.getElementById('get-stream-btn').addEventListener('click', () => {
    fetch(`/getStream/${sessionId}/${streamId}${location.search}`, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => { log(JSON.stringify(data, null, 2)); });
  });

  document.getElementById('list-archives-btn').addEventListener('click', () => {
    fetch(`/listArchives/${sessionId}${location.search}`, {
      method: 'get',
    })
      .then((response) => response.json())
      .then((data) => { log(JSON.stringify(data, null, 2)); });
  });

  document.getElementById('set-class-list-btn').addEventListener('click', () => {
    fetch(`/setStreamClassLists/${sessionId}/${streamId}${location.search}`, {
      method: 'get',
    })
      .then(log('stream class list updated'));
  });
});

session.connect(token);
