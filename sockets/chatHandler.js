module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Usuário conectado:', socket.id);

        socket.on('join_room', (data) => {
            socket.join(data);
            console.log(`Usuário ${socket.id} entrou na sala: ${data}`);
        });

        socket.on('send_message', (data) => {
            // data: { room, text, sender, id, timestamp }
            io.to(data.room).emit('receive_message', data);
        });

        socket.on('typing', (data) => {
            socket.to(data.room).emit('display_typing', data);
        });

        socket.on('disconnect', () => {
            console.log('Usuário desconectado:', socket.id);
        });
    });
};
