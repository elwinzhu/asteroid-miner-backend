const {WebSocketServer} = require('ws');


let clients = [];
let pingTimer;

const clientClose = (ws) => (code, reason) => {
    ws.terminate();
};

const dispatchMessage = (ws) => (message, isBinary) => {
    let msg = JSON.parse(message);

    console.log(msg);
};


function heartbeat() {
    this.isAlive = true;
}

function connection(ws) {
    ws.isAlive = true;

    clients.push(ws);
    ws.on('error', (error) => {
    });
    ws.on('pong', heartbeat);
    ws.on('message', dispatchMessage(ws));
    ws.on('close', clientClose(ws));
}

const wss = new WebSocketServer({
    port: 9527,
    path: "/asteroid-miners"
});

function startPing() {
    clearTimeout(pingTimer);
    pingTimer = setTimeout(function ping() {
        wss.clients.forEach(function each(ws) {
            if (!ws.isAlive)
                return ws.terminate();

            ws.isAlive = false;
            ws.ping();
        });

        startPing();
    }, 60 * 1000);
}

function serverClose() {
    console.log('server is closed.');
    clearInterval(pingTimer);
}

wss.on('listening', () => {
    console.log('ws server is listening on 9527');
});
wss.on('connection', connection);
wss.on('close', serverClose);
startPing();