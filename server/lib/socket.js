let sockets = [];
module.exports = function (socket) {
    let id = 'client-8df' + new Date().getTime() * 3;
    socket.send(JSON.stringify({
        control: 1, // 1 means specify clientID
        clientID: id
    }));
    socket['clientID'] = id;
    sockets.push(socket);
    socket.addEventListener('message', (d) => {
        if (d.data === 'ping') socket.write('pong');
        let data = JSON.parse(d.data);
        if (data.control === 0 && data.from === socket.clientID) {
            // this is the data source.
            sockets.map(s => {
                if (s.clientID !== data.from) {
                    s.send(JSON.stringify({
                        control: 0,
                        clientName: socket.clientName,
                        clientID: socket.clientID,
                        message: data.message
                    }))
                }
            });
            socket.send(JSON.stringify({
                control: 3
            }))
        }
        if (data.control === 2 && data.clientName) {
            socket.clientName = data.clientName.substr(0, 20);
            socket.send(JSON.stringify({
                control: 2,
                clientName: socket.clientName
            }))
            sockets.map(s => {
                if (s.clientID !== socket.clientID)
                    s.send(JSON.stringify({
                        control: 4, // new client
                        clientName: socket.clientName,
                        clientID: socket.clientID
                    }));
            })
        }
    })
    socket.addEventListener('close', () => {
        let newsockets = [];
        sockets.map(s => {
            if (s.clientID !== socket.clientID) {
                newsockets.push(s);
                s.send(JSON.stringify({
                    control: 5,
                    clientName: socket.clientName
                }))
            }
        })
        sockets = newsockets;
    })
}