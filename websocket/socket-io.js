const {Server} = require("socket.io");

function generateSocketId() {
    let x = Math.floor(Math.random() * 10000);
    return parseInt(`${Date.now()}${x}`).toString(16);
}

function useSocketIo(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            // origin: process.env.FRONTEND_URL || "http://localhost:3000",
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    let clients = [];

    io.on('connection', (socket) => {
        socket.id = generateSocketId();
        clients.push(socket);

        socket.on('disconnect', () => {
            console.log('socket disconnected.', socket.id);
            let index = clients.findIndex(client=>client.id === socket.id);
            if (index > -1) {
                clients.splice(index, 1);
            }
        });
    });

    return io;
}

module.exports = {
    useSocketIo
};