#!/usr/bin/env node

process.on('uncaughtException', function (err) {
    console.log(err.message);
});

const app_mode = process.env.APP_MODE;
const node_env = process.env.NODE_ENV;
console.log(`Environment: ${node_env}, AppMode: ${app_mode}`);

const app = require('./app');
const http = require('http');
const {useSocketIo} = require("./websocket/socket-io");


/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '1680');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
let io = useSocketIo(server);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}

const {run} = require("./mine-asteroids");
run(io);
